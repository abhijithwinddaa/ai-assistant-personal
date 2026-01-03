import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore, indexTheDocument } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  // Index the PDF if it hasn't been indexed yet
  console.log("📄 Indexing PDF document...");
  const filePath = "./cg-internal-docs.pdf";
  try {
    await indexTheDocument(filePath);
    console.log("✅ PDF indexed successfully!\n");
  } catch (error) {
    console.log("⚠️ Note: Make sure the PDF file exists at", filePath, "\n");
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");
    if (question === "/bye") {
      break;
    }

    // retrieval
    const relevantChunks = await vectorStore.similaritySearch(question, 3);
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know.`;

    const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log(`Assistant: ${completion.choices[0].message.content}`);
  }

  rl.close();
}

chat();
