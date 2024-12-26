// Map of special movie IDs to their correct video URLs
const specialMovieUrls: Record<string, string> = {
  'tt0208092': 'https://vidsrc.net/embed/movie/tt0208092/', // Snatch (2000)
};

export const getVideoUrl = (id: string, mediaType: 'movie' | 'tv', seasonNum?: number, episodeNum?: number): string => {
  // Check for special cases first
  if (specialMovieUrls[id]) {
    return specialMovieUrls[id];
  }

  // Default URLs
  if (mediaType === 'tv') {
    return `https://vidsrc.me/embed/tv?tmdb=${id}${seasonNum ? `&season=${seasonNum}` : ''}${episodeNum ? `&episode=${episodeNum}` : ''}`;
  }
  
  return `https://vidsrc.me/embed/movie?tmdb=${id}`;
};