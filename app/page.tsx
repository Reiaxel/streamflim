'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContentSection from '@/components/ContentSection';
import { 
  fetchTrendingContent, 
  fetchMovies, 
  fetchTVShows, 
  fetchKidsContent, 
  fetchDocumentaries 
} from '@/lib/api';
import type { Content } from '@/lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [kids, setKids] = useState<Content[]>([]);
  const [documentaries, setDocumentaries] = useState<Content[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [trendingData, moviesData, seriesData, kidsData, documentariesData] = await Promise.all([
          fetchTrendingContent(),
          fetchMovies(),
          fetchTVShows(),
          fetchKidsContent(),
          fetchDocumentaries()
        ]);

        setTrendingContent(trendingData);
        setMovies(moviesData);
        setSeries(seriesData);
        setKids(kidsData);
        setDocumentaries(documentariesData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  const featuredContent = trendingContent.filter(content => content.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero featuredContent={featuredContent} />
        
        <div className="container mx-auto px-4 py-12 space-y-12">
          <ContentSection
            title="Tendencias"
            content={trendingContent.slice(0, 8)}
            size="large"
          />
          
          <ContentSection
            title="Películas Populares"
            content={movies}
            size="medium"
          />
          
          <ContentSection
            title="Series Recomendadas"
            content={series}
            size="medium"
          />
          
          <ContentSection
            title="Para Toda la Familia"
            content={kids}
            size="medium"
          />
          
          <ContentSection
            title="Documentales Impresionantes"
            content={documentaries}
            size="medium"
          />
        </div>
      </main>
    </div>
  );
}