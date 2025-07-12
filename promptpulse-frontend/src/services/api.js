// src/services/api.js

const API_BASE_URL = 'http://localhost:8000/api';

export async function searchBrand(brand) {
  const response = await fetch(`${API_BASE_URL}/brands/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      brand_name: brand,
      keywords: [brand],
      save_to_db: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Add more API functions as needed 