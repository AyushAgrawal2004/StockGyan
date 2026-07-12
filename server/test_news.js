import YahooFinance from 'yahoo-finance2';
async function run() {
  const yahooFinance = new YahooFinance();
  const res = await yahooFinance.search('TCS', { newsCount: 3 });
  console.log(JSON.stringify(res.news, null, 2));
}
run();
