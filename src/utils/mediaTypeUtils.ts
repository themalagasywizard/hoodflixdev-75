export const determineMediaType = (media: any): 'movie' | 'tv' => {
  // First check if it's explicitly a movie
  if (
    media.media_type === 'movie' ||
    media.title || // Movies typically have 'title'
    media.release_date || // Movies have release_date
    media.runtime // Movies have runtime
  ) {
    return 'movie';
  }

  // Then check if it's explicitly a TV show
  if (
    media.media_type === 'tv' ||
    media.first_air_date ||
    media.number_of_seasons ||
    media.episode_run_time ||
    media.type === 'tv' ||
    (media.name && !media.title) // TV shows typically use 'name' instead of 'title'
  ) {
    return 'tv';
  }

  // If we can't determine definitively, default to movie
  return 'movie';
};