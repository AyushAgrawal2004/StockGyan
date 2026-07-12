import { stockGraph } from '../langgraph/graph.js';

// Simple in-memory store for rate limiting (no MongoDB required)
const tokenStore = new Map();

export const analyzeCompany = async (req, res) => {
  const { query } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  if (!query) {
    return res.status(400).json({ error: 'Company query is required.' });
  }

  try {
    // 1. Check Token Quota
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quota = tokenStore.get(ip);
    if (quota) {
      if (quota.lastResetDate < today) {
        quota.tokensUsed = 0;
        quota.lastResetDate = new Date();
      }
    } else {
      quota = { ipAddress: ip, tokensUsed: 0, lastResetDate: new Date() };
    }

    // Uncomment this if you want to enforce the limit!
    // if (quota.tokensUsed >= 5) {
    //   return res.status(429).json({ error: 'Daily AI analysis quota (5/5) exceeded. Please try again tomorrow.' });
    // }

    // 2. Run LangGraph
    const initialState = { query };
    const finalState = await stockGraph.invoke(initialState);
    
    // 3. Consume token and save
    quota.tokensUsed += 1;
    tokenStore.set(ip, quota);

    res.json({
      success: true,
      data: finalState.analysisResult,
      tokensUsed: quota.tokensUsed,
      tokensRemaining: 5 - quota.tokensUsed,
      meta: {
        ticker: finalState.ticker,
        companyName: finalState.companyName,
        quote: finalState.quote,
        news: finalState.news,
        historicalReturns: finalState.historicalReturns,
        marketReturns: finalState.marketReturns
      }
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    const msg = error.message || 'An error occurred during analysis.';
    
    // If it's a "No Indian company found" error, it's a bad request (400) or not found (404)
    if (msg.includes('No Indian company found')) {
      return res.status(404).json({ error: msg });
    }
    
    res.status(500).json({ error: msg });
  }
};
