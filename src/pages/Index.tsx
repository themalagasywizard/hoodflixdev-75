import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ViewerCount from '../components/ViewerCount';
import Settings from '../components/Settings';
import { translateText, translatePage } from '../utils/translate';

interface Movie {
  id: string;
  title: string;
  name?: string;
  poster_path: string;
  media_type?: string;
}

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [viewerCount, setViewerCount] = useState(500);

  const apiKey = '650ff50a48a7379fd245c173ad422ff8';

  const categories = {
    '28': 'Action',
    '12': 'Adventure',
    '16': 'Animation',
    '35': 'Comedy',
    '80': 'Crime',
    '99': 'Documentary',
    '18': 'Drama',
    '10751': 'Family',
    '14': 'Fantasy',
    '36': 'History',
    '27': 'Horror',
    '10402': 'Music',
    '9648': 'Mystery',
    '10749': 'Romance',
    '878': 'Science Fiction',
    '10770': 'TV Movie',
    '53': 'Thriller',
    '10752': 'War',
    '37': 'Western'
  };

  useEffect(() => {
    const storedDyslexicPref = localStorage.getItem('dyslexicFont') === 'true';
    setIsDyslexicFont(storedDyslexicPref);
    if (storedDyslexicPref) {
      document.body.classList.add('dyslexic');
    }

    showAllCategories();
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const responses = await Promise.all([
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=2`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=3`)
      ]);
      
      const data = await Promise.all(responses.map(r => r.json()));
      const allMovies = data.flatMap(d => d.results);
      
      setMovies(allMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const showAllCategories = () => {
    setSelectedCategory('all');
    fetchMovies();
  };

  const filterCategory = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    try {
      const [moviesData, tvShowsData] = await Promise.all([
        Promise.all([1, 2, 3].map(page => 
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${categoryId}&page=${page}`)
            .then(res => res.json())
        )),
        Promise.all([1, 2, 3].map(page => 
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${categoryId}&page=${page}`)
            .then(res => res.json())
        ))
      ]);
      
      const allMovies = moviesData.flatMap(data => data.results);
      const allTvShows = tvShowsData.flatMap(data => data.results);
      
      setMovies([...allMovies, ...allTvShows]);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&page=1`
      );
      const data = await response.json();
      setSearchResults(data.results.filter((result: Movie) => 
        (result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path
      ));
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const playMedia = (id: string, type: string) => {
    const url = type === 'movie' 
      ? `https://vidsrc.me/embed/movie?tmdb=${id}` 
      : `https://vidsrc.me/embed/tv?tmdb=${id}`;
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleDyslexicFont = () => {
    const newValue = !isDyslexicFont;
    setIsDyslexicFont(newValue);
    localStorage.setItem('dyslexicFont', String(newValue));
    document.body.classList.toggle('dyslexic', newValue);
  };

  const handleLanguageChange = async (lang: string) => {
    setCurrentLanguage(lang);
    await translatePage(lang);
    
    document.documentElement.lang = lang;
    
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white relative select-none">
      <StarryBackground />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-lg shadow-black/50 border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="https://i.ibb.co/wMf2zc7/hood-FLIX-7-8-2024.png" 
            alt="Hoodflix" 
            className="h-8 md:h-10"
          />
          
          <nav className="flex-1 mx-8 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-6">
              <button
                onClick={showAllCategories}
                className="text-white hover:text-[#ea384c] transition-all duration-300"
                data-translate
                data-original-text="Home"
              >
                Home
              </button>
              {Object.entries(categories).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => filterCategory(id)}
                  className="text-white hover:text-[#ea384c] transition-all duration-300"
                  data-translate
                  data-original-text={name}
                >
                  {name}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-[rgba(234,56,76,0.1)] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Settings
              currentLanguage={currentLanguage}
              isDyslexicFont={isDyslexicFont}
              onLanguageChange={handleLanguageChange}
              onToggleDyslexicFont={toggleDyslexicFont}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-20 relative z-10">
        <div id="video-container" className="mb-8"></div>
        
        {showSearch && (
          <div className="fixed inset-0 bg-[#141414]/95 z-50 p-4 overflow-y-auto">
            <div className="max-w-5xl mx-auto pt-20">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }
                }}
                placeholder="Search movies and TV shows..."
                className="w-full p-4 bg-[#2a2a2a] rounded-lg text-white placeholder:text-white/50 border-none outline-none select-text"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 pb-20 animate-fade-in">
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="relative group transition-transform duration-300 hover:scale-105 cursor-pointer animate-fade-in aspect-[2/3]"
                    onClick={() => {
                      playMedia(result.id, result.media_type || 'movie');
                      setShowSearch(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                      alt={result.title || result.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="absolute bottom-2 left-2 right-2 text-center text-white text-sm">
                        {result.title || result.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in">
          {movies.map((movie, index) => (
            <div 
              key={`${movie.id}-${index}`}
              className="relative group transition-all duration-300 hover:scale-110 animate-fade-in aspect-[2/3]"
              style={{
                animationDelay: `${index * 50}ms`
              }}
              onClick={() => playMedia(movie.id, movie.media_type || 'movie')}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover rounded-lg shadow-[0_0_15px_rgba(234,56,76,0.3)] 
                         transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(234,56,76,0.5)]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            rounded-lg">
                <p className="absolute bottom-2 left-2 right-2 text-center text-white text-sm
                            font-medium">
                  {movie.title || movie.name}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>

      <footer className="mt-8 pb-12 text-center text-sm text-gray-400">
        <p className="font-medium">
          © Copyright {new Date().getFullYear()} by{' '}
          <span className="text-[#ea384c] hover:text-[#ff4d63] transition-colors duration-300">
            aidenwrld
          </span>
        </p>
      </footer>

      <ViewerCount />
    </div>
  );
};

export default Index;
