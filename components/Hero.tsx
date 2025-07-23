'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import type { Content } from '@/lib/api';

interface HeroProps {
  featuredContent: Content[];
}

const Hero = ({ featuredContent }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (featuredContent.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % featuredContent.length
      );
    }, 8000); // Cambiar cada 8 segundos

    return () => clearInterval(interval);
  }, [featuredContent.length]);

  if (featuredContent.length === 0) return null;

  const currentContent = featuredContent[currentIndex];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src={currentContent.backdrop || currentContent.image}
          alt={currentContent.title}
          className="w-full h-full object-cover scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = currentContent.image;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
            {currentContent.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-lg mb-6">
            <span className="text-green-400 font-medium">
              {Math.round(currentContent.rating * 10)}% Recomendado
            </span>
            <span className="text-white/70">{currentContent.year}</span>
            <span className="text-white/70">{currentContent.duration}</span>
            <div className="px-2 py-1 border border-white/30 rounded text-sm">
              {currentContent.category === 'movie' ? 'PELÍCULA' : 'SERIE'}
            </div>
          </div>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            {currentContent.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {currentContent.genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white/90 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/watch/${currentContent.id}`}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/90 transition-colors hover-glow"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Reproducir</span>
            </Link>
            
            <Link
              href={`/details/${currentContent.id}`}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors"
            >
              <Info className="w-6 h-6" />
              <span>Más información</span>
            </Link>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;