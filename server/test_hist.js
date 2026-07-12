import YahooFinance from 'yahoo-finance2';
async function run() {
  const yahooFinance = new YahooFinance();
  const date5YearsAgo = new Date();
  date5YearsAgo.setFullYear(date5YearsAgo.getFullYear() - 5);
  
  const res = await yahooFinance.chart('TCS.NS', { 
    period1: date5YearsAgo,
    period2: new Date(),
    interval: '1mo' 
  });
  console.log('Got data:', res.quotes.length);
  if (res.quotes.length > 0) {
    console.log('Earliest:', res.quotes[0].date, res.quotes[0].close);
    console.log('Latest:', res.quotes[res.quotes.length-1].date, res.quotes[res.quotes.length-1].close);
  }
}
run();
