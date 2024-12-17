import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Translations object
  const translations = {
    en: {
      home: 'Home',
      search: 'Search movies and TV shows...',
      action: 'Action',
      adventure: 'Adventure',
      animation: 'Animation',
      comedy: 'Comedy',
      crime: 'Crime',
      documentary: 'Documentary',
      drama: 'Drama',
      family: 'Family',
      fantasy: 'Fantasy',
      history: 'History',
      horror: 'Horror',
      music: 'Music',
      mystery: 'Mystery',
      romance: 'Romance',
      scienceFiction: 'Science Fiction',
      tvMovie: 'TV Movie',
      thriller: 'Thriller',
      war: 'War',
      western: 'Western',
      viewers: 'people watching worldwide',
      settings: 'Settings',
      language: 'Language',
      dyslexicFont: 'Dyslexic Font'
    },
    es: {
      // Spanish translations
      home: 'Inicio',
      search: 'Buscar películas y series...',
      action: 'Acción',
      adventure: 'Aventura',
      // ... add all other translations
    },
    // Add other language translations similarly
  };

  useEffect(() => {
    // Initialize to home tab
    showAllCategories();
    
    // Start viewer count simulation
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply dyslexic font
    document.body.classList.toggle('dyslexic', isDyslexicFont);
  }, [isDyslexicFont]);

  const toggleDyslexicFont = () => {
    setIsDyslexicFont(!isDyslexicFont);
    toast({
      title: isDyslexicFont ? "Dyslexic font disabled" : "Dyslexic font enabled",
      duration: 2000
    });
  };

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    toast({
      title: `Language changed to ${translations[lang].language}`,
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(20,20,20,0.95)] backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="https://i.ibb.co/wMf2zc7/hood-FLIX-7-8-2024.png" 
            alt="Hoodflix" 
            className="h-8 md:h-10"
          />
          
          <nav className="flex-1 mx-8 overflow-x-auto scrollbar-hide">
            {/* Navigation links with hover animation */}
            <div className="flex space-x-6">
              {Object.entries(categories).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => filterCategory(id)}
                  className="text-white hover:text-[#ea384c] transition-all duration-300 
                           relative after:content-[''] after:absolute after:bottom-0 after:left-0 
                           after:w-full after:h-0.5 after:bg-[#ea384c] after:scale-x-0 
                           after:origin-bottom-right hover:after:scale-x-100 
                           hover:after:origin-bottom-left after:transition-transform"
                >
                  {translations[currentLanguage][name.toLowerCase()] || name}
                </button>
              ))}
            </div>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-[rgba(234,56,76,0.1)] transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleSettings}
                className="p-2 rounded-full hover:bg-[rgba(234,56,76,0.1)] transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
              
              {/* Settings dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 rounded-md shadow-lg py-1">
                  {['en', 'es', 'ru', 'sl', 'tr'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="block w-full px-4 py-2 text-sm text-white hover:bg-[rgba(234,56,76,0.1)]"
                    >
                      {translations[lang].language}
                    </button>
                  ))}
                  <button
                    onClick={toggleDyslexicFont}
                    className="block w-full px-4 py-2 text-sm text-white hover:bg-[rgba(234,56,76,0.1)]"
                  >
                    {translations[currentLanguage].dyslexicFont}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pt-20 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map(movie => (
            <div 
              key={movie.id}
              className="relative group transition-transform duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-[0_0_15px_rgba(234,56,76,0.3)] 
                         transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(234,56,76,0.5)]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-center 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">{movie.title}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Viewer count */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm animate-fade-in">
        {viewerCount} {translations[currentLanguage].viewers}
      </div>
    </div>
  );
};

export default Index;