export const determineMediaType = (media: any): 'movie' | 'tv' => {
  // Check multiple properties to determine if it's a TV series
  if (
    media.media_type === 'tv' || // Check explicit media_type
    media.first_air_date || // Check TV-specific date field
    media.name || // TV shows typically use 'name' instead of 'title'
    media.number_of_seasons || // TV-specific property
    media.episode_run_time // TV-specific property
  ) {
    return 'tv';
  }
  return 'movie';
};