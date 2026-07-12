import YahooFinance from 'yahoo-finance2';
async function fetchReturns(ticker) {
  const yahooFinance = new YahooFinance();
  const date5YearsAgo = new Date();
  date5YearsAgo.setFullYear(date5YearsAgo.getFullYear() - 5);
  date5YearsAgo.setMonth(date5YearsAgo.getMonth() - 1);
  
  const res = await yahooFinance.chart(ticker, { period1: date5YearsAgo, interval: '1mo' });
  const quotes = res.quotes || [];
  
  const now = new Date();
  const currentPrice = quotes[quotes.length-1].adjclose || quotes[quotes.length-1].close;
  console.log(ticker, "Current Adj Price:", currentPrice);
  
  const getReturn = (years) => {
    const targetDate = new Date();
    targetDate.setFullYear(now.getFullYear() - years);
    let closest = quotes[0];
    for(const q of quotes) {
       if (new Date(q.date) <= targetDate) closest = q;
       else break;
    }
    const closestPrice = closest.adjclose || closest.close;
    console.log(ticker, years, "years ago adj price:", closestPrice);
    return ((currentPrice - closestPrice) / closestPrice) * 100;
  };
  
  return { "1Y": getReturn(1), "3Y": getReturn(3), "5Y": getReturn(5) };
}
async function run() {
  console.log(await fetchReturns('TCS.NS'));
}
run();
