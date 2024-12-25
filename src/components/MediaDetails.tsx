import React from 'react';
import { ArrowLeft, Star, Play } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface MediaDetailsProps {
  id: string;
  title: string;
  overview: string;
  rating: number;
  posterPath: string;
  mediaType: 'movie' | 'tv';
  onBack: () => void;
  onSelectEpisode?: (seasonNum: number, episodeNum: number) => void;
}

const MediaDetails = ({ 
  id, 
  title, 
  overview, 
  rating, 
  posterPath,
  mediaType,
  onBack,
  onSelectEpisode 
}: MediaDetailsProps) => {
  const [seasons, setSeasons] = React.useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<number | null>(null);
  const apiKey = '650ff50a48a7379fd245c173ad422ff8';

  React.useEffect(() => {
    if (mediaType === 'tv') {
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          setSeasons(data.seasons || []);
        });
    }
  }, [id, mediaType]);

  const handleSeasonSelect = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  const handleEpisodeSelect = (seasonNum: number, episodeNum: number) => {
    onSelectEpisode?.(seasonNum, episodeNum);
  };

  const handlePlayClick = () => {
    const url = mediaType === 'movie' 
      ? `https://vidsrc.me/embed/movie?tmdb=${id}` 
      : `https://vidsrc.me/embed/tv?tmdb=${id}`;
    
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      
      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#ea384c] hover:text-[#ff4d63] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to browsing
        </button>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
          <CardContent className="p-6">
            <div className="flex gap-6">
              <img
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={title}
                className="w-48 rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg">{rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-300 mb-6">{overview}</p>

                <Button 
                  onClick={handlePlayClick}
                  className="bg-[#ea384c] hover:bg-[#ff4d63] mb-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Now
                </Button>

                {mediaType === 'tv' && seasons.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Seasons</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {seasons.map((season) => (
                        <button
                          key={season.season_number}
                          onClick={() => handleSeasonSelect(season.season_number)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedSeason === season.season_number
                              ? 'border-[#ea384c] bg-[#ea384c]/10'
                              : 'border-[#2a2a2a] hover:border-[#ea384c]/50'
                          }`}
                        >
                          Season {season.season_number}
                        </button>
                      ))}
                    </div>

                    {selectedSeason !== null && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">Episodes</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {Array.from({ length: seasons[selectedSeason]?.episode_count || 0 }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleEpisodeSelect(selectedSeason, index + 1)}
                              className="p-3 rounded-lg border border-[#2a2a2a] hover:border-[#ea384c]/50 transition-all"
                            >
                              Episode {index + 1}
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