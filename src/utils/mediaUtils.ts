export const filterCategory = async (categoryId: string) => {
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${categoryId}`
  );
  return response.json();
};

export const fetchTVSeries = async () => {
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`
  );
  return response.json();
};

export const fetchTVSeriesByCategory = async (categoryId: string) => {
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${categoryId}`
  );
  return response.json();
};

export const handleSearch = async (query: string) => {
  if (!query.trim()) return [];
  
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results || [];
};