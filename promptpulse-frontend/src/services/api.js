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

export async function discoverCompetitors(websiteUrl) {
  const response = await fetch('http://localhost:8000/api/brands/discover-competitors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ website_url: websiteUrl }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data.competitors;
}

export async function discoverPrompts(websiteUrl, competitors) {
  const response = await fetch('http://localhost:8000/api/brands/discover-prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ website_url: websiteUrl, competitors }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data.prompts;
}

export async function extractBrandInfo(websiteUrl) {
  const response = await fetch('http://localhost:8000/api/brands/extract-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ website_url: websiteUrl }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return await response.json();
}

// Add more API functions as needed 