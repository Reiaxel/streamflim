'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ContentSection from '@/components/ContentSection';
import { fetchMovies } from '@/lib/api';
import type { Content } from '@/lib/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Películas</h1>
            <p className="text-lg text-muted-foreground">
              Descubre nuestra colección de películas en alta calidad
            </p>
          </div>
          
          <ContentSection
            title="Todas las Películas"
            content={movies}
            size="medium"
          />
        </div>
      </main>
    </div>
  );
}