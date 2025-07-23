'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import type { Content } from '@/lib/data';

interface ContentSectionProps {
  title: string;
  content: Content[];
  size?: 'small' | 'medium' | 'large';
}

const ContentSection = ({ title, content, size = 'medium' }: ContentSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = size === 'small' ? 200 : size === 'medium' ? 272 : 336;
  const maxScroll = Math.max(0, (content.length * itemWidth) - (window.innerWidth - 100));

  const scroll = (direction: 'left' | 'right') => {
    const scrollAmount = itemWidth * 3;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(maxScroll, scrollPosition + scrollAmount);
    
    setScrollPosition(newPosition);
  };

  if (content.length === 0) return null;

  return (
    <section className="mb-8 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          className="flex space-x-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {content.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <ContentCard content={item} size={size} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;