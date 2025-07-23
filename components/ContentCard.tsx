'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import type { Content } from '@/lib/api';

interface ContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
}

const ContentCard = ({ content, size = 'medium' }: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    small: 'w-48 h-72',
    medium: 'w-64 h-96',
    large: 'w-80 h-[28rem]'
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} group cursor-pointer transition-all duration-300 hover:scale-105 hover-glow animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <img
          src={content.image}
          alt={content.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg';
          }}
        />
        
        {/* Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium">{content.rating}</span>
        </div>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold mb-1 line-clamp-2">{content.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
            <span>{content.year}</span>
            <span>•</span>
            <span>{content.duration}</span>
            <span>•</span>
            <span className="capitalize">{content.genres[0]}</span>
          </div>
          
          {/* Action Buttons - Show on Hover */}
          <div className={`flex items-center space-x-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link
              href={`/watch/${content.id}`}
              className="flex items-center space-x-1 bg-primary hover:bg-primary/80 text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Ver ahora</span>
            </Link>
            <Link
              href={`/details/${content.id}`}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Más info</span>
            </Link>
          </div>
        </div>

        {/* Trailer Preview on Hover (Simulado) */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                <Play className="w-8 h-8 text-primary fill-current" />
              </div>
              <p className="text-sm text-gray-300">Preview del trailer</p>
            </div>
          </div>
        )}
      </div>

      {/* Description Card - Extended on Hover */}
      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-card glass-effect rounded-b-lg p-4 border-t-0 z-10 transform transition-all duration-300">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {content.genres.map((genre, index) => (
              <span
                key={index}
                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;