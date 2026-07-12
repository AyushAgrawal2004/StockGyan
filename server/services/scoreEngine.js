/**
 * Deterministic Investment Scoring Engine
 * Calculates a score out of 100 based on company fundamentals.
 */

// Helper to bound values between min and max
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// Helper: Financial Health (Max 35)
const calcFinancialHealth = (fd) => {
  if (!fd) return 0;
  let score = 0;

  // 1. Revenue Growth (10) - >15% is perfect
  const revGrowth = fd.revenueGrowth || 0;
  if (revGrowth > 0.15) score += 10;
  else if (revGrowth > 0.05) score += 7;
  else if (revGrowth > 0) score += 4;

  // 2. Earnings/Profit Growth (10) - >15% is perfect
  const profitGrowth = fd.earningsGrowth || 0;
  if (profitGrowth > 0.15) score += 10;
  else if (profitGrowth > 0.05) score += 7;
  else if (profitGrowth > 0) score += 4;

  // 3. Debt to Equity (8) - <50% is perfect
  const debt = fd.debtToEquity || 0; 
  // Yahoo debtToEquity is usually in percentage e.g. 50 = 50%
  if (debt < 30 && debt >= 0) score += 8;
  else if (debt < 70) score += 5;
  else if (debt < 150) score += 2;
  // if missing but they have cash, give partial
  else if (!fd.debtToEquity) score += 4; 

  // 4. ROE (7) - >15% is perfect
  const roe = fd.returnOnEquity || 0;
  if (roe > 0.15) score += 7;
  else if (roe > 0.10) score += 5;
  else if (roe > 0.05) score += 3;

  return clamp(score, 0, 35);
};

// Helper: Valuation (Max 20)
const calcValuation = (sd, dks, price) => {
  let score = 0;
  
  // 1. PE Ratio (10) - between 10 and 25 is ideal for growth
  const pe = sd?.trailingPE || 0;
  if (pe > 0 && pe <= 20) score += 10;
  else if (pe > 20 && pe <= 35) score += 7;
  else if (pe > 35 && pe <= 50) score += 4;
  else if (pe > 50) score += 1; // Overvalued

  // 2. PB Ratio (5) - < 3 is great
  const pb = dks?.priceToBook || 0;
  if (pb > 0 && pb <= 3) score += 5;
  else if (pb > 3 && pb <= 6) score += 3;
  else if (pb > 6) score += 1;

  // 3. Market Cap Stability (5) - Large cap > 20,000 Cr is most stable
  const mcap = price?.marketCap || 0;
  if (mcap > 500e9) score += 5; // Very Large Cap
  else if (mcap > 100e9) score += 4; // Mid Cap
  else if (mcap > 10e9) score += 2; // Small Cap
  else score += 1;

  return clamp(score, 0, 20);
};

// Helper: Growth (Max 20)
const calcGrowth = (hist) => {
  if (!hist) return 0;
  let score = 0;

  // 1 Year (5)
  if (hist['1Y'] > 15) score += 5;
  else if (hist['1Y'] > 5) score += 3;
  else if (hist['1Y'] > 0) score += 1;

  // 3 Year (7)
  if (hist['3Y'] > 40) score += 7;
  else if (hist['3Y'] > 20) score += 4;
  else if (hist['3Y'] > 0) score += 2;

  // 5 Year (8)
  if (hist['5Y'] > 80) score += 8;
  else if (hist['5Y'] > 40) score += 5;
  else if (hist['5Y'] > 0) score += 2;

  return clamp(score, 0, 20);
};

// Helper: News Sentiment (Max 15)
const calcNews = (newsArray) => {
  if (!newsArray || newsArray.length === 0) return 7; // Neutral fallback
  
  const positiveWords = ['surge', 'jump', 'profit', 'win', 'growth', 'dividend', 'acquire', 'bull', 'buy', 'up', 'high', 'strong', 'record'];
  const negativeWords = ['fall', 'crash', 'loss', 'decline', 'penalty', 'scam', 'sell', 'down', 'low', 'weak', 'miss', 'bear', 'drop'];
  
  let score = 7; // Start neutral
  
  newsArray.forEach(article => {
    const title = article.title?.toLowerCase() || '';
    let posCount = 0;
    let negCount = 0;
    
    positiveWords.forEach(w => { if (title.includes(w)) posCount++; });
    negativeWords.forEach(w => { if (title.includes(w)) negCount++; });
    
    if (posCount > negCount) score += 2.5;
    else if (negCount > posCount) score -= 2.5;
  });

  return Math.round(clamp(score, 0, 15));
};

// Helper: Risk (Max 10) - Higher score = Lower Risk
const calcRisk = (sd) => {
  let score = 0;
  
  // Beta (5) - between 0.8 and 1.2 is stable
  const beta = sd?.beta || 1;
  if (beta > 0.8 && beta < 1.2) score += 5;
  else if (beta <= 0.8 && beta > 0) score += 4; // Low volatility
  else if (beta >= 1.2 && beta < 1.5) score += 3; // High volatility
  else score += 1; // Very high volatility

  // Other Risk (5) - Simplified to assume standard 4 for large companies if they have data
  score += 4;

  return clamp(score, 0, 10);
};

/**
 * Main Scoring Engine
 */
export const calculateInvestmentScore = (quote, historicalReturns, news) => {
  try {
    const fd = quote.financialData || {};
    const sd = quote.summaryDetail || {};
    const dks = quote.defaultKeyStatistics || {};
    const p = quote.price || {};

    const financial = calcFinancialHealth(fd);
    const valuation = calcValuation(sd, dks, p);
    const growth = calcGrowth(historicalReturns);
    const newsScore = calcNews(news);
    const risk = calcRisk(sd);

    const totalScore = financial + valuation + growth + newsScore + risk;

    return {
      score: Math.round(clamp(totalScore, 0, 100)),
      breakdown: {
        financial: Math.round(financial),
        valuation: Math.round(valuation),
        growth: Math.round(growth),
        news: Math.round(newsScore),
        risk: Math.round(risk)
      }
    };
  } catch (err) {
    console.error("Score Calculation Error:", err);
    // Safe fallback
    return {
      score: 50,
      breakdown: { financial: 15, valuation: 10, growth: 10, news: 10, risk: 5 }
    };
  }
};
