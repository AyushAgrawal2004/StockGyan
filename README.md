# 📈 StockGyan

> **"Chatbots guess. We calculate."**

StockGyan is an experimental, AI-powered financial research platform explicitly designed for the Indian Stock Market (NSE/BSE). By combining deterministic financial modeling with advanced Large Language Models (LLMs), StockGyan provides deep, instant, and human-readable analysis of any Indian stock.

🔗 **Live Demo:** [https://stock-gyan.vercel.app/](https://stock-gyan.vercel.app/)

![StockGyan Interface](client/src/assets/hero.png?v=3)

## ✨ Features

- **Multi-Agent Architecture**: Built with LangGraph, StockGyan utilizes a network of AI agents to pull real-time data, parse financial statements, analyze market sentiment, and generate a final verdict.
- **Deterministic Verdict Engine**: We don't let AI guess your financial future. We calculate a strict 100-point Investment Score using the Yahoo Finance API (P/E Ratio, Revenue Growth, ROE, Debt, etc.) before the LLM ever sees it.
- **Learning vs. Pro Modes**: Toggle between 'Learning Mode' (where complex metrics are explained using simple analogies) and 'Pro Mode' (unfiltered data and advanced ratios for seasoned investors).
- **Wealth Journey**: A visual timeline showing exactly how a ₹1,00,000 investment in a stock would have performed over 1, 3, and 5 years compared to the NIFTY 50 index.
- **Beautiful UI/UX**: A state-of-the-art interface built with React, TailwindCSS v4, and buttery-smooth scroll animations powered by GSAP.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS v4
- **Animations**: GSAP (GreenSock) & Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend (Server)
- **Runtime**: Node.js + Express
- **AI/LLM Framework**: LangGraph & LangChain
- **LLM Provider**: Groq (Llama 3.3 70B Versatile)
- **Data Providers**: Yahoo Finance (yahoo-finance2) & GNews API

## 🚀 How It Works (The 5-Step Methodology)

1. **Validation**: We verify the ticker against the NSE/BSE registry.
2. **Data Extraction**: The `fetchFinancials` node scrapes live pricing, income statements, and balance sheets.
3. **News Sentiment**: The `fetchNews` node pulls the latest headlines to detect market sentiment and potential red flags.
4. **Scoring Engine**: Our deterministic math model scores the company out of 100 based on Financial Health (35%), Valuation (20%), Growth (20%), Sentiment (15%), and Risk (10%).
5. **AI Synthesis**: Llama 3.3 analyzes the raw data alongside the calculated score to write a highly conversational, easy-to-digest report.

## 💻 Local Development

Want to run StockGyan on your own machine? It's incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushAgrawal2004/StockGyan.git
   cd StockGyan
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

3. **Install Dependencies & Run:**
   The project is configured to run both the frontend and backend concurrently from the root directory.
   ```bash
   npm install
   npm run dev
   ```
   *Frontend will run on `http://localhost:5173` and Backend on `http://localhost:5001`.*

## 🌍 Production Deployment

StockGyan is architected for zero-database, serverless-friendly deployment. 

### 1. Deploying the Backend (Render)
We recommend deploying the backend to an always-on service like **Render (Web Service)** so the in-memory token rate-limiter functions correctly.
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Environment**: Add `GROQ_API_KEY`.

### 2. Deploying the Frontend (Vercel)
Once the backend is live, you can deploy the lightning-fast frontend to Vercel.
- **Root Directory**: `client`
- Vercel will automatically detect Vite and run `npm run build`.
- *Note: Our frontend automatically detects production environments and routes API calls to the live Render backend URL.*

## ⚖️ Key Decisions & Trade-offs

1. **Deterministic Math vs. Pure LLM**: 
   *Decision*: We calculate the score deterministically using raw financial data before the LLM sees it. 
   *Trade-off*: Takes more backend processing time, but completely eliminates the risk of the LLM hallucinating investment viability or doing math wrong.
2. **In-Memory Rate Limiting vs. Database**: 
   *Decision*: Removed MongoDB and used an in-memory Node cache to track the 5-token limit per IP. 
   *Trade-off*: The limit resets if the server restarts, but it allows for a drastically simpler, free, and instantly deployable architecture.
3. **Groq Llama 3.3 over OpenAI**: 
   *Decision*: Used Groq's Llama 3.3 70B Versatile model. 
   *Trade-off*: Slightly different reasoning capabilities than GPT-4, but provides blazing fast, near-instant inference which is critical for a smooth user experience.

## 📊 Example Runs

Here is how the agent performs on a few popular Indian stocks:
- **Reliance Industries (RELIANCE.NS)**: Identifies strong market dominance and steady revenue growth, usually resulting in a "Hold" or "Buy" depending on current P/E valuations.
- **Zomato (ZOMATO.NS)**: Recognizes the high-growth trajectory but flags the extremely high P/E ratio and volatility, advising caution for value investors.
- **Yes Bank (YESBANK.NS)**: Instantly flags poor historical returns, high debt, and negative sentiment, resulting in a strict "Strong Avoid" verdict.

## 🚀 What I Would Improve With More Time

1. **Vector Database for RAG**: I would integrate Pinecone or ChromaDB to store 10 years of historical SEC/NSE filings, allowing the LLM to read through actual earnings call transcripts instead of just relying on current Yahoo Finance metrics.
2. **User Authentication & Portfolios**: Add NextAuth/Firebase so users can log in, save their searches, and track a mock portfolio.
3. **Advanced Technical Indicators**: The current engine focuses heavily on fundamental analysis. I would add MACD, RSI, and Bollinger Bands to the LangGraph node data for short-term trading insights.
4. **WebSockets for Streaming**: Instead of waiting for the full LLM response, I would implement WebSockets to stream the LangChain thought process (e.g. "Analyzing Debt...", "Reading News...") directly to the UI in real-time.

## ⚠️ Disclaimer

StockGyan is an experimental AI project. The insights, scores, and verdicts provided are for **educational and informational purposes only**. This is **not financial advice**. Always consult a SEBI-registered financial advisor before making real investments in the stock market. Historical performance does not guarantee future results.
