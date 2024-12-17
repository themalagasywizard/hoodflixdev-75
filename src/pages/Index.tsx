import { useState, useEffect } from 'react';
import { Search, Settings } from 'lucide-react';

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
    // Add stagger effect to movie items
    const movieItems = document.querySelectorAll('.result-item');
    movieItems.forEach((item, index) => {
      (item as HTMLElement).style.animationDelay = `${index * 100}ms`;
    });

    // Initialize to home tab
    showAllCategories();
    
    // Simulate viewer count updates
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    // Fetch initial movies
    fetchMovies();

    return () => clearInterval(interval);
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch 3 pages of movies for more content
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
      // Fetch multiple pages for both movies and TV shows
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
    
    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    // Find or create video container
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const displayMovies = (movies: Movie[]) => {
    return movies.map((movie, index) => (
      <div
        key={`${movie.id}-${index}`}
        className="result-item"
        style={{
          animationDelay: `${index * 50}ms`
        }}
        onClick={() => {
          playMedia(movie.id, movie.media_type || 'movie');
          setShowSearch(false);
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full rounded-lg transition-all duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="absolute bottom-2 left-2 right-2 text-center text-white text-sm">
            {movie.title || movie.name}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="https://i.ibb.co/wMf2zc7/hood-FLIX-7-8-2024.png" 
            alt="Hoodflix" 
            className="h-8 md:h-10 transition-transform duration-300 hover:scale-105"
          />
          
          <nav className="flex-1 mx-8 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-6">
              {Object.entries(categories).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => filterCategory(id)}
                  className="nav-link text-white hover:text-[#ea384c] transition-all duration-300"
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
            
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-[rgba(234,56,76,0.1)] transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 settings-dropdown rounded-md shadow-lg py-1 border border-[#2a2a2a]">
                  <button
                    onClick={() => {
                      setCurrentLanguage('en');
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    English (United States)
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage('es');
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    Español (Spanish)
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage('ru');
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    Русский (Russian)
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage('sl');
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    Slovenščina (Slovenian)
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage('tr');
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    Türkçe (Turkish)
                  </button>
                  <button
                    onClick={() => {
                      setIsDyslexicFont(!isDyslexicFont);
                      setShowSettings(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-white settings-option text-left"
                  >
                    Dyslexic Font
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-20">
        <div id="video-container" className="mb-8"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {displayMovies(movies)}
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm animate-pulse">
        {viewerCount} people watching worldwide
      </div>
    </div>
  );
};

export default Index;
