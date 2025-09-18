'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, Share, ArrowLeft, Star } from 'lucide-react';
import Header from '@/components/Header';
import ContentSection from '@/components/ContentSection';
import { fetchContentById, fetchTrendingContent, categoryLabels } from '@/lib/api';
import type { Content } from '@/lib/api';

export default function DetailsPage() {
  const params = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentId = params.id as string;
        const [contentData, trendingData] = await Promise.all([
          fetchContentById(contentId),
          fetchTrendingContent()
        ]);
        
        setContent(contentData);
        
        if (contentData) {
          const related = trendingData.filter(item => 
            item.id !== contentData.id && 
            (item.category === contentData.category || 
             item.genres.some(genre => contentData.genres.includes(genre)))
          ).slice(0, 8);
          setRelatedContent(related);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [params.id]);

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

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contenido no encontrado</h1>
          <Link href="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-end">
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              <Image
                src={content.image}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 pb-12">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4 text-white">{content.title}</h1>
              
              <div className="flex items-center space-x-6 text-lg mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white">{content.rating}</span>
                </div>
                <span className="text-white/80">{content.year}</span>
                <span className="text-white/80">{content.duration}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  {categoryLabels[content.category]}
                </span>
              </div>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {content.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {content.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href={`/watch/${content.id}`}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/90 transition-colors hover-glow"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Reproducir</span>
                </Link>
                
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Mi lista</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Tráiler</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={content.trailer}
              title={`${content.title} - Tráiler`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

        {/* Related Content */}
        {relatedContent.length > 0 && (
          <div className="container mx-auto px-4 pb-12">
            <ContentSection
              title="Contenido similar"
              content={relatedContent}
              size="medium"
            />
          </div>
        )}
      </main>
    </div>
  );
}
