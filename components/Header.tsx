'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Play } from 'lucide-react';
import { searchContent } from '@/lib/api';
import type { Content } from '@/lib/api';

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchContent(query);
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold gradient-text">StreamFlix</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
              Películas
            </Link>
            <Link href="/series" className="text-sm font-medium hover:text-primary transition-colors">
              Series
            </Link>
            <Link href="/kids" className="text-sm font-medium hover:text-primary transition-colors">
              Infantil
            </Link>
            <Link href="/documentaries" className="text-sm font-medium hover:text-primary transition-colors">
              Documentales
            </Link>
          </nav>

          {/* Search */}
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div 
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    isSearchActive ? 'bg-black/30 rounded-full px-4 py-2' : ''
                  }`}
                >
                  <Search 
                    className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" 
                    onClick={() => setIsSearchActive(!isSearchActive)}
                  />
                  <input
                    type="text"
                    placeholder="Buscar contenido..."
                    className={`bg-transparent outline-none transition-all duration-300 ${
                      isSearchActive ? 'w-64 opacity-100' : 'w-0 opacity-0'
                    }`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-96 right-0 glass-effect rounded-lg p-4 space-y-2">
                    {searchResults.map((content) => (
                      <Link
                        key={content.id}
                        href={`/watch/${content.id}`}
                        className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSearchActive(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <img
                          src={content.image}
                          alt={content.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{content.title}</p>
                          <p className="text-xs text-muted-foreground">{content.year} • {content.genres[0]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-lg p-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
                Películas
              </Link>
              <Link href="/series" className="text-sm font-medium hover:text-primary transition-colors">
                Series
              </Link>
              <Link href="/kids" className="text-sm font-medium hover:text-primary transition-colors">
                Infantil
              </Link>
              <Link href="/documentaries" className="text-sm font-medium hover:text-primary transition-colors">
                Documentales
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;