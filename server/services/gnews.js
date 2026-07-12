import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const fetchNews = async (companyName) => {
  try {
    const res = await yahooFinance.search(companyName, { newsCount: 3 });
    if (!res || !res.news) return [];
    
    return res.news.slice(0, 3).map(article => ({
      title: article.title,
      url: article.link,
      source: article.publisher || 'Yahoo Finance',
      date: new Date(article.providerPublishTime).toISOString()
    }));
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return [];
  }
};
