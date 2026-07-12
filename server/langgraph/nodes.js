import { ChatGroq } from "@langchain/groq";
import { searchCompany, fetchFinancials, fetchHistoricalReturns } from "../services/yahooFinance.js";
import { fetchNews } from "../services/gnews.js";
import { calculateInvestmentScore } from "../services/scoreEngine.js";
import { getVerdict, getRiskLevel } from "../services/verdictEngine.js";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' }); // Assuming .env is at root level

// Helper to format currency
const fmtCur = (v) => {
  if (v == null || isNaN(v)) return 'N/A';
  const a = Math.abs(v), pre = '₹';
  if (a >= 1e12) return pre + (v/1e12).toFixed(2) + 'T';
  if (a >= 1e9)  return pre + (v/1e9).toFixed(2)  + 'B';
  if (a >= 1e7)  return pre + (v/1e7).toFixed(2)  + ' Cr';
  if (a >= 1e5)  return pre + (v/1e5).toFixed(2)  + ' L';
  return pre + v.toFixed(2);
};

export const validateCompanyNode = async (state) => {
  const hit = await searchCompany(state.query);
  return { ticker: hit.symbol, companyName: hit.name };
};

export const fetchFinancialsNode = async (state) => {
  const quote = await fetchFinancials(state.ticker);
  // Fetch returns concurrently for stock and market (NIFTY 50)
  const [historicalReturns, marketReturns] = await Promise.all([
    fetchHistoricalReturns(state.ticker),
    fetchHistoricalReturns('^NSEI')
  ]);
  return { quote, historicalReturns, marketReturns };
};

export const fetchNewsNode = async (state) => {
  const articles = await fetchNews(state.companyName);
  return { news: articles };
};

export const llmAnalysisNode = async (state) => {
  const { quote, news, companyName, historicalReturns, marketReturns } = state;
  const p = quote.price, sd = quote.summaryDetail, fd = quote.financialData, pr = quote.summaryProfile;
  const inc = quote.incomeStatementHistory?.incomeStatementHistory?.[0];

  const pe = sd?.trailingPE;
  const revGr = fd?.revenueGrowth;
  const netInc = inc?.netIncome;
  const debt = fd?.totalDebt;
  const roe = fd?.returnOnEquity;
  const cratio = fd?.currentRatio;
  const mktCap = p?.marketCap;
  const divYld = sd?.dividendYield;
  const beta = sd?.beta;
  const sector = pr?.sector || 'Unknown';
  const headlines = news.map(a => a.title).join('\n') || 'No recent news.';
  
  const h = historicalReturns || {};
  const m = marketReturns || {};

  // Calculate algorithmic score and deterministic verdict
  const invScore = calculateInvestmentScore(quote, historicalReturns, news);
  const verdictObj = getVerdict(invScore.score);
  const riskLevel = getRiskLevel(quote);

  const prompt = `You are StockGyan, an AI investment analyst for Indian stock markets. Analyse "${companyName}" (${sector} sector).

Financial data:
- P/E Ratio: ${pe ? pe.toFixed(1) : 'N/A'}
- Revenue Growth YoY: ${revGr != null ? (revGr*100).toFixed(1)+'%' : 'N/A'}
- Net Income: ${netInc != null ? fmtCur(netInc) : 'N/A'}
- Total Debt: ${debt != null ? fmtCur(debt) : 'N/A'}
- ROE: ${roe != null ? (roe*100).toFixed(1)+'%' : 'N/A'}
- Current Ratio: ${cratio != null ? cratio.toFixed(2) : 'N/A'}
- Market Cap: ${mktCap != null ? fmtCur(mktCap) : 'N/A'}
- Dividend Yield: ${divYld != null ? (divYld*100).toFixed(2)+'%' : 'N/A'}
- Beta: ${beta != null ? beta.toFixed(2) : 'N/A'}

Historical Returns (Company vs NIFTY 50):
- 1 Year: Company ${h['1Y']?.toFixed(1)}% vs Market ${m['1Y']?.toFixed(1)}%
- 3 Years: Company ${h['3Y']?.toFixed(1)}% vs Market ${m['3Y']?.toFixed(1)}%
- 5 Years: Company ${h['5Y']?.toFixed(1)}% vs Market ${m['5Y']?.toFixed(1)}%

Algorithmic Investment Score: ${invScore.score}/100
Verdict Engine Result: ${verdictObj.verdict}
Risk Level: ${riskLevel}
Breakdown: Financial (${invScore.breakdown.financial}/35), Valuation (${invScore.breakdown.valuation}/20), Growth (${invScore.breakdown.growth}/20), News (${invScore.breakdown.news}/15), Risk (${invScore.breakdown.risk}/10).

Your job is to explain WHY this verdict and score are appropriate. Do NOT hallucinate your own verdict or risk level. Accept the provided verdict.

Recent news headlines:
${headlines}

Reply with ONLY a raw JSON object (no markdown, no backticks, no explanation) in this exact structure:
{
  "conversational_summary": {
    "quick_summary": "YOUR_QUICK_SUMMARY_IN_QUOTES",
    "for_beginners": "YOUR_BEGINNER_ADVICE_IN_QUOTES",
    "for_long_term": "YOUR_LONG_TERM_ADVICE_IN_QUOTES",
    "biggest_opportunity": "YOUR_OPPORTUNITY_IN_QUOTES",
    "biggest_risk": "YOUR_RISK_IN_QUOTES"
  },
  "wealth_journey_insight": "YOUR_3_TO_4_LINE_EXPLANATION_OF_WHAT_THE_HISTORICAL_RETURNS_TELL_US_IN_QUOTES",
  "risk_analysis": {
    "business": { "level": "Low", "detail": "YOUR_DETAIL_IN_QUOTES" },
    "financial": { "level": "Medium", "detail": "YOUR_DETAIL_IN_QUOTES" },
    "market": { "level": "High", "detail": "YOUR_DETAIL_IN_QUOTES" },
    "sector": { "level": "Medium", "detail": "YOUR_DETAIL_IN_QUOTES" }
  },
  "verdict_reasons": [
    "YOUR_REASON_IN_QUOTES"
  ],
  "news_sentiments": [
    { "title": "HEADLINE_MATCH_IN_QUOTES", "sentiment": "positive", "summary": "YOUR_1_SENTENCE_SUMMARY_IN_QUOTES" }
  ]
}`;

  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_CLOUD_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }
  
  const llm = new ChatGroq({
    apiKey: apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    maxTokens: 1024,
    modelKwargs: { response_format: { type: "json_object" } }
  });

  const response = await llm.invoke([{ role: "user", content: prompt }]);
  let content = response.content;
  
  // Clean up if it contains markdown code blocks
  content = content.replace(/```json/gi, "").replace(/```/g, "").trim();
  
  let analysisResult;
  try {
    analysisResult = JSON.parse(content);
  } catch (e) {
    console.error("Raw LLM Output causing parse error:", content);
    // Basic fallback parsing if malformed
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        analysisResult = JSON.parse(match[0]);
      } catch (err) {
        throw new Error("Failed to parse LLM JSON output. See server logs for raw output.");
      }
    } else {
      throw new Error("Failed to parse LLM JSON output. See server logs for raw output.");
    }
  }

  // Inject the dynamically calculated score and verdict into the AI response
  analysisResult.score = invScore.score;
  analysisResult.score_breakdown = invScore.breakdown;
  analysisResult.verdictData = verdictObj;
  analysisResult.overall_risk_level = riskLevel;

  return { analysisResult };
};
