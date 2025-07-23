'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import Header from '@/components/Header';
import { fetchContentById } from '@/lib/api';
import type { Content } from '@/lib/api';

export default function WatchPage() {
  const params = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentId = params.id as string;
        const contentData = await fetchContentById(contentId);
        setContent(contentData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [params.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div 
        className="relative w-full h-screen cursor-pointer"
        onClick={togglePlay}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Video Background */}
        <div className="absolute inset-0 bg-black">
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Play Button Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-24 h-24 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Play className="w-12 h-12 text-white fill-current ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
              <Link
                href={`/details/${content.id}`}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-lg">{content.title}</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="text-white/80 hover:text-white transition-colors">
                  <Settings className="w-6 h-6" />
                </button>
                <button className="text-white/80 hover:text-white transition-colors">
                  <Maximize className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/70 mt-2">
                <span>
                  {Math.floor(progress * 1.2)}:{String(Math.floor((progress * 1.2) % 1 * 60)).padStart(2, '0')}
                </span>
                <span>{content.duration}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-current" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>

                <div className="text-white">
                  <h3 className="font-semibold">{content.title}</h3>
                  <p className="text-sm text-white/70">{content.year} • {content.genres[0]}</p>
                </div>
              </div>

              <div className="text-right text-white">
                <p className="text-sm text-white/70">Calidad: HD</p>
                <p className="text-sm text-white/70">Audio: Español</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}