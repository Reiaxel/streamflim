'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ContentSection from '@/components/ContentSection';
import { fetchDocumentaries } from '@/lib/api';
import type { Content } from '@/lib/api';

export default function DocumentariesPage() {
  const [documentaries, setDocumentaries] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocumentaries = async () => {
      try {
        const documentariesData = await fetchDocumentaries();
        setDocumentaries(documentariesData);
      } catch (error) {
        console.error('Error loading documentaries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentaries();
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
            <h1 className="text-4xl font-bold gradient-text mb-4">Documentales</h1>
            <p className="text-lg text-muted-foreground">
              Explora el mundo a través de documentales fascinantes
            </p>
          </div>
          
          <ContentSection
            title="Todos los Documentales"
            content={documentaries}
            size="medium"
          />
        </div>
      </main>
    </div>
  );
}