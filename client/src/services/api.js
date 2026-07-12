const API_BASE_URL = import.meta.env.PROD 
  ? 'https://stockgyan.onrender.com/api' 
  : 'http://localhost:5001/api';

export const analyzeStock = async (query) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze stock');
  }
  return data;
};
