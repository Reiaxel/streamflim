'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ContentSection from '@/components/ContentSection';
import { fetchKidsContent } from '@/lib/api';
import type { Content } from '@/lib/api';

export default function KidsPage() {
  const [kids, setKids] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKidsContent = async () => {
      try {
        const kidsData = await fetchKidsContent();
        setKids(kidsData);
      } catch (error) {
        console.error('Error loading kids content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKidsContent();
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
            <h1 className="text-4xl font-bold gradient-text mb-4">Contenido Infantil</h1>
            <p className="text-lg text-muted-foreground">
              Diversión y aprendizaje para toda la familia
            </p>
          </div>
          
          <ContentSection
            title="Para Niños"
            content={kids}
            size="medium"
          />
        </div>
      </main>
    </div>
  );
}