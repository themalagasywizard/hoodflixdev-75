export const determineMediaType = (media: any): 'movie' | 'tv' => {
  // Special case for known movies
  const knownMovies = {
    'tt0208092': 'movie', // Snatch (2000)
  };

  if (media.id && knownMovies[media.id]) {
    return knownMovies[media.id];
  }

  // Check explicit media_type first
  if (media.media_type === 'tv') {
    return 'tv';
  }

  if (media.media_type === 'movie') {
    return 'movie';
  }

  // Check movie-specific properties
  const movieIndicators = [
    media.release_date,
    media.runtime,
    media.title && !media.name,
    media.original_title
  ];

  if (movieIndicators.some(indicator => indicator)) {
    return 'movie';
  }

  // Check TV-specific properties
  const tvIndicators = [
    media.first_air_date,
    media.number_of_seasons,
    media.episode_run_time,
    media.name && !media.title
  ];

  if (tvIndicators.some(indicator => indicator)) {
    return 'tv';
  }

  // Default to movie if we can't determine
  return 'movie';
};