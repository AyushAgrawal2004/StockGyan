import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const searchCompany = async (query) => {
  try {
    const results = await yahooFinance.search(query, { quotesCount: 5, newsCount: 0 });
    const quotes = results.quotes || [];
    
    // Prioritize Indian NSE/BSE stocks if possible
    const pick = quotes.find(q => q.symbol?.endsWith('.NS') && q.quoteType === 'EQUITY')
              || quotes.find(q => q.symbol?.endsWith('.BO') && q.quoteType === 'EQUITY')
              || quotes.find(q => q.quoteType === 'EQUITY');
              
    if (!pick) {
      throw new Error(`No Indian company found for "${query}". Try a more specific name.`);
    }
    return { symbol: pick.symbol, name: pick.longname || pick.shortname || query };
  } catch (err) {
    throw new Error('Company search failed: ' + err.message);
  }
};

export const fetchFinancials = async (ticker) => {
  try {
    const quote = await yahooFinance.quoteSummary(ticker, { 
      modules: ['price', 'summaryDetail', 'financialData', 'defaultKeyStatistics', 'incomeStatementHistory', 'cashflowStatementHistory', 'summaryProfile'] 
    });
    return quote;
  } catch (err) {
    throw new Error('Financial data fetch failed: ' + err.message);
  }
};

export const fetchHistoricalReturns = async (ticker) => {
  try {
    const date5YearsAgo = new Date();
    date5YearsAgo.setFullYear(date5YearsAgo.getFullYear() - 5);
    date5YearsAgo.setMonth(date5YearsAgo.getMonth() - 1); // Add a buffer
    
    const res = await yahooFinance.chart(ticker, { period1: date5YearsAgo, interval: '1mo' });
    const quotes = res.quotes || [];
    if (quotes.length === 0) return { "1Y": 0, "3Y": 0, "5Y": 0 };
    
    const now = new Date();
    const currentPrice = quotes[quotes.length - 1].adjclose || quotes[quotes.length - 1].close;
    
    const getReturn = (years) => {
      const targetDate = new Date();
      targetDate.setFullYear(now.getFullYear() - years);
      let closest = quotes[0];
      for (const q of quotes) {
         if (new Date(q.date) <= targetDate) closest = q;
         else break;
      }
      const closestPrice = closest.adjclose || closest.close;
      if (!closestPrice) return 0;
      return ((currentPrice - closestPrice) / closestPrice) * 100;
    };
    
    return {
       "1Y": getReturn(1),
       "3Y": getReturn(3),
       "5Y": getReturn(5)
    };
  } catch (err) {
    console.error(`Historical fetch failed for ${ticker}:`, err.message);
    return { "1Y": 0, "3Y": 0, "5Y": 0 };
  }
};
