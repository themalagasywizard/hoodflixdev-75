import React from 'react';
import { ArrowLeft, Star, Play } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { determineMediaType } from '../utils/mediaTypeUtils';

interface MediaDetailsProps {
  id: string;
  title: string;
  overview: string;
  rating: number;
  posterPath: string;
  mediaType: 'movie' | 'tv';
  onBack: () => void;
  onSelectEpisode?: (seasonNum: number, episodeNum: number) => void;
  category?: string;
}

const MediaDetails = ({ 
  id, 
  title, 
  overview, 
  rating, 
  posterPath,
  mediaType,
  onBack,
  onSelectEpisode,
  category 
}: MediaDetailsProps) => {
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<number | null>(null);
  const [episodes, setEpisodes] = React.useState<any[]>([]);
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';

  const clearVideoContainer = () => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer && videoContainer.firstChild) {
      videoContainer.innerHTML = '';
    }
  };

  const createVideoIframe = (url: string) => {
    clearVideoContainer();
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      videoContainer.appendChild(iframe);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
        const data = await response.json();
        
        if (data.seasons && data.seasons.length > 0) {
          // Filter out season 0 and sort seasons
          const filteredSeasons = data.seasons
            .filter((season: any) => season.season_number > 0)
            .sort((a: any, b: any) => a.season_number - b.season_number);
          
          setSeasons(filteredSeasons);
          if (filteredSeasons.length > 0) {
            handleSeasonSelect(filteredSeasons[0].season_number);
          }
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
        setSeasons([]);
      }
    };

    fetchSeasons();
  }, [id]);

  const handleSeasonSelect = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apiKey}`
      );
      const data = await response.json();
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setEpisodes([]);
    }
  };

  const handleEpisodeSelect = (seasonNum: number, episodeNum: number) => {
    if (onSelectEpisode) {
      onSelectEpisode(seasonNum, episodeNum);
    }
    const url = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${seasonNum}&episode=${episodeNum}`;
    createVideoIframe(url);
    onBack(); // Close the details window
  };

  const handlePlayClick = () => {
    if (seasons.length > 0 && selectedSeason !== null) {
      handleEpisodeSelect(selectedSeason, 1);
    } else {
      const url = `https://vidsrc.me/embed/movie?tmdb=${id}`;
      createVideoIframe(url);
      onBack(); // Close the details window
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto pt-16 sm:pt-20">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-[#ea384c] hover:text-[#ff4d63] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to browsing
        </button>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <img
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title}
                className="w-32 sm:w-40 rounded-lg shadow-lg self-center sm:self-start"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{title}</h2>
                  {category && (
                    <Badge variant="secondary" className="bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20">
                      {category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg">{rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">{overview}</p>

                <Button 
                  onClick={handlePlayClick}
                  className="w-full sm:w-auto bg-[#ea384c] hover:bg-[#ff4d63] mb-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {seasons.length > 0 ? 'Play Episode' : 'Play Movie'}
                </Button>

                {seasons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Seasons</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
                      {seasons.map((season) => (
                        <button
                          key={season.season_number}
                          onClick={() => handleSeasonSelect(season.season_number)}
                          className={`p-2 sm:p-3 rounded-lg border text-sm sm:text-base transition-all ${
                            selectedSeason === season.season_number
                              ? 'border-[#ea384c] bg-[#ea384c]/10'
                              : 'border-[#2a2a2a] hover:border-[#ea384c]/50'
                          }`}
                        >
                          S{season.season_number}
                        </button>
                      ))}
                    </div>

                    {selectedSeason !== null && episodes.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">Episodes</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-4">
                          {episodes.map((episode) => (
                            <button
                              key={episode.episode_number}
                              onClick={() => handleEpisodeSelect(selectedSeason, episode.episode_number)}
                              className="p-2 sm:p-3 rounded-lg border border-[#2a2a2a] hover:border-[#ea384c]/50 transition-all text-sm sm:text-base"
                            >
                              E{episode.episode_number}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaDetails;