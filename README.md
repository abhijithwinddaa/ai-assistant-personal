# Company Chatbot - RAG-Based Q&A System

A production-ready **Retrieval-Augmented Generation (RAG)** chatbot application that combines document retrieval with AI language models for accurate, context-aware answers.

## Table of Contents

- [Features](#features)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Keys & Configuration](#api-keys--configuration)
- [Project Structure](#project-structure)
- [How to Use](#how-to-use)
- [How It Works](#how-it-works)
- [Integrating into Your App](#integrating-into-your-app)
- [Troubleshooting](#troubleshooting)

---

## Features

✅ **PDF Document Indexing** - Automatically extract and chunk PDF documents

✅ **Vector Embeddings** - Azure OpenAI's text-embedding-3-small (512 dimensions)

✅ **Vector Database** - Pinecone for fast similarity search

✅ **RAG Pipeline** - Retrieval + LLM for accurate answers

✅ **Free AI Model** - Groq's Llama 3.3 70B for responses

✅ **Interactive CLI** - Chat interface with `/bye` to exit

✅ **Production Ready** - Easy to integrate into existing apps

---

## Project Architecture

```
User Question
     ↓
[1] Vector Search (Pinecone)
     ↓
Retrieve 3 Most Similar Chunks from PDF
     ↓
[2] Combine: Question + Context
     ↓
[3] LLM Processing (Groq)
     ↓
AI Generated Answer
```

### Tech Stack

- **Embeddings**: Azure OpenAI (text-embedding-3-small)
- **Vector Database**: Pinecone
- **LLM**: Groq (Llama 3.3 70B)
- **Framework**: LangChain (JavaScript)
- **Runtime**: Node.js 18+

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- Three API Keys:
  1. **Azure OpenAI** - For embeddings
  2. **Pinecone** - For vector database
  3. **Groq** - For LLM

---

## Installation

### Step 1: Clone/Navigate to Project

```bash
cd "f:\FullStack Projects\company-chatbot"
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

This installs all required packages:
- `@langchain/openai` - Azure OpenAI integration
- `@langchain/pinecone` - Pinecone vector store
- `@langchain/community` - PDF loader
- `groq-sdk` - Groq API
- `dotenv` - Environment variable management

### Step 3: Place Your PDF Document

Place your PDF document in the project root:

```
f:\FullStack Projects\company-chatbot\cg-internal-docs.pdf
```

---

## API Keys & Configuration

### 1. Azure OpenAI API Key

**What it does**: Converts text into 512-dimensional vectors

**How to get it**:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create/open an Azure OpenAI resource
3. Deploy model: `text-embedding-3-small`
4. Copy:
   - API Key
   - API Endpoint URL
   - Deployment Name

**In `.env`**:

```dotenv
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=text-embedding-3-small
```

---

### 2. Pinecone API Key & Index

**What it does**: Stores and searches vector embeddings

**How to get it**:
1. Go to [Pinecone Console](https://app.pinecone.io)
2. Create a new index with:
   - **Name**: `company-chatbot-index`
   - **Dimensions**: `512` ⚠️ (MUST match embedding model)
   - **Metric**: `cosine`
   - **Pod Type**: `s1` (free tier)
3. Copy your **API Key** from dashboard

**⚠️ Important - Dimension Matching**:

```
text-embedding-3-small → 512 dimensions
text-embedding-3-large → 3072 dimensions
```

Make sure your Pinecone index dimensions match your embedding model!

**In `.env`**:

```dotenv
PINECONE_API_KEY=pcsk_xxxxxx
PINECONE_INDEX_NAME=company-chatbot-index
```

---

### 3. Groq API Key

**What it does**: Provides free, fast LLM responses

**How to get it**:
1. Go to [Groq Console](https://console.groq.com)
2. Sign up/login
3. Create API key in settings
4. Copy the key

**In `.env`**:

```dotenv
GROQ_API_KEY=gsk_xxxxxx
```

---

### Complete `.env` File

```dotenv
# Azure OpenAI - For embeddings (text-embedding-3-small)
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=text-embedding-3-small

# Pinecone - Vector database
PINECONE_API_KEY=your_api_key_here
PINECONE_INDEX_NAME=company-chatbot-index

# Groq - LLM provider (free)
GROQ_API_KEY=your_groq_key_here
```

---

## Project Structure

```
company-chatbot/
├── package.json          # Dependencies & scripts
├── .env                  # API keys (⚠️ NEVER commit this!)
├── chat.js              # Main entry point - Interactive CLI chatbot
├── prepare.js           # PDF indexing & embeddings setup
├── rag.js               # RAG planning document
├── cg-internal-docs.pdf # Your PDF document
└── README.md            # This file
```

### File Descriptions

| File | Purpose |
|------|---------|
| `chat.js` | Main chatbot interface. Indexes PDF on startup, then enters chat loop |
| `prepare.js` | Sets up Azure embeddings, Pinecone connection, and document indexing |
| `rag.js` | Implementation plan (not actively used) |

---

## How to Use

### Start the Chatbot

```bash
npm start
```

Or:

```bash
npm run dev
```

### First Run

1. **PDF Indexing**: The app automatically loads and chunks your PDF
2. **Embedding Creation**: Converts chunks to 512-dimensional vectors
3. **Pinecone Upload**: Stores embeddings in your Pinecone index
4. **Chat Ready**: You can now ask questions!

### Chat Interface

```
📄 Indexing PDF document...
✅ PDF indexed successfully!

You: What is the company culture?
Assistant: Based on the documentation, the company culture emphasizes...

You: What are the benefits?
Assistant: Our company offers the following benefits...

You: /bye
```

Type `/bye` to exit the chatbot.

---

## How It Works

### Step-by-Step Process

1. **Document Loading** (`chat.js`)
   - Loads PDF using LangChain's PDFLoader
   - Extracts all text content

2. **Chunking** (`prepare.js`)
   - Splits text into 500-character chunks
   - 100-character overlap for context continuity

3. **Embeddings** (`prepare.js`)
   - Azure OpenAI converts each chunk → 512-dim vector
   - Semantic representation of text content

4. **Storage** (`prepare.js`)
   - Pinecone stores vectors with metadata
   - Enables fast similarity search

5. **Retrieval** (`chat.js`)
   - User question → 512-dim vector
   - Find 3 most similar chunks from Pinecone
   - Extract relevant text

6. **Generation** (`chat.js`)
   - Combine: User question + Retrieved context
   - Send to Groq's Llama 3.3 70B
   - Get natural language answer

---

## Integrating into Your App

### Option 1: Express.js Backend

Create an API endpoint for your chat:

```javascript
import express from "express";
import { vectorStore } from "./prepare.js";
import Groq from "groq-sdk";

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const userQuestion = req.body.message;
    
    // Step 1: Retrieve context from Pinecone
    const relevantChunks = await vectorStore.similaritySearch(userQuestion, 3);
    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    
    // Step 2: Generate answer with LLM
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Use the provided context to answer questions."
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${userQuestion}`
        }
      ],
      model: "llama-3.3-70b-versatile"
    });
    
    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Option 2: React Frontend Integration

```javascript
// In your React component
const [response, setResponse] = useState("");

const askQuestion = async (question) => {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: question })
  });
  const data = await res.json();
  setResponse(data.answer);
};
```

---

## Troubleshooting

### ❌ "Cannot find module @langchain/core/messages"

**Solution**: Update dependencies

```bash
npm install @langchain/core@latest --legacy-peer-deps
```

### ❌ "PineconeNotFoundError: HTTP 404"

**Solution**: Check your `.env`
- Verify `PINECONE_INDEX_NAME` matches your actual index name
- Make sure index exists in Pinecone console

### ❌ "Dimensions mismatch: Expected 512, got 1536"

**Solution**: Recreate your Pinecone index with dimensions: `512`
- Delete current index
- Create new with: 512 dimensions, cosine metric

### ❌ "PDF not found"

**Solution**: Place PDF in project root

```
f:\FullStack Projects\company-chatbot\cg-internal-docs.pdf
```

### ❌ "API Key invalid"

**Solution**:
- Copy full key from console (no extra spaces)
- Check if key is still active
- Regenerate new key if needed

### ✅ How to verify setup?

```bash
# Test Azure OpenAI
node -e "console.log(process.env.AZURE_OPENAI_KEY)"

# Test Pinecone
node -e "console.log(process.env.PINECONE_API_KEY)"

# Test Groq
node -e "console.log(process.env.GROQ_API_KEY)"
```

All should show your keys (no "undefined").

---

## Advanced Features

### Add Multiple Documents

```javascript
// In chat.js, before chat starts
await indexTheDocument("./doc1.pdf");
await indexTheDocument("./doc2.pdf");
await indexTheDocument("./doc3.pdf");
```

### Change Retrieval Count

```javascript
// Default: 3 chunks. In chat.js:
const relevantChunks = await vectorStore.similaritySearch(question, 5); // Get 5 chunks
```

### Customize Chunking

```javascript
// In prepare.js
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,      // Larger chunks
  chunkOverlap: 200,    // More context
});
```

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Azure OpenAI | ~$0.02 per 1M tokens | For embeddings |
| Pinecone | Free | Up to 100K vectors (free tier) |
| Groq | Free | Completely free with fair usage |
| **Total** | **~Free** | Minimal costs for production |

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file to Git
- Rotate API keys periodically
- Use environment variables in production
- Add `.env` to `.gitignore`:

```
.env
node_modules/
.DS_Store
```

---

## License

ISC

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [How It Works](#how-it-works) diagram
3. Verify all API keys in `.env`

---

**Happy Chatting! 🤖**
