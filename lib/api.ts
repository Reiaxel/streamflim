const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const IMAGE_BASE_URL_ORIGINAL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL_ORIGINAL;

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  category: 'movie' | 'series' | 'kids' | 'documentary';
  year: number;
  duration: string;
  rating: number;
  genres: string[];
  image: string;
  backdrop: string;
  trailer: string;
  featured?: boolean;
}

// Mapeo de géneros para categorización
const KIDS_GENRE_IDS = [16]; // Animación
const DOCUMENTARY_GENRE_IDS = [99]; // Documental

const genreMap: { [key: number]: string } = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familia',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia Ficción',
  10770: 'Película de TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western'
};

function determineCategory(genreIds: number[], isAdult: boolean): 'movie' | 'series' | 'kids' | 'documentary' {
  if (isAdult) return 'movie';
  if (genreIds.some(id => DOCUMENTARY_GENRE_IDS.includes(id))) return 'documentary';
  if (genreIds.some(id => KIDS_GENRE_IDS.includes(id))) return 'kids';
  return 'movie';
}

function mapTMDBToContent(item: TMDBMovie | TMDBTVShow, type: 'movie' | 'tv'): Content {
  const isMovie = type === 'movie';
  const tmdbItem = item as any;
  
  return {
    id: item.id.toString(),
    title: isMovie ? tmdbItem.title : tmdbItem.name,
    description: item.overview || 'Sin descripción disponible',
    category: type === 'tv' ? 'series' : determineCategory(item.genre_ids, tmdbItem.adult || false),
    year: new Date(isMovie ? tmdbItem.release_date : tmdbItem.first_air_date).getFullYear() || 2024,
    duration: isMovie ? '2h 0min' : '1 temporada',
    rating: Math.round(item.vote_average * 10) / 10,
    genres: item.genre_ids.map(id => genreMap[id] || 'Desconocido').filter(Boolean),
    image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg',
    backdrop: item.backdrop_path ? `${IMAGE_BASE_URL_ORIGINAL}${item.backdrop_path}` : 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg',
    trailer: `https://www.youtube.com/embed/dQw4w9WgXcQ`, // Placeholder
    featured: item.vote_average > 7.5
  };
}

export async function fetchTrendingContent(): Promise<Content[]> {
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`),
      fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=es-ES`)
    ]);

    const moviesData = await moviesResponse.json();
    const tvData = await tvResponse.json();

    const movies = moviesData.results?.slice(0, 10).map((movie: TMDBMovie) => mapTMDBToContent(movie, 'movie')) || [];
    const tvShows = tvData.results?.slice(0, 10).map((show: TMDBTVShow) => mapTMDBToContent(show, 'tv')) || [];

    return [...movies, ...tvShows];
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
}

export async function fetchMovies(): Promise<Content[]> {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    const data = await response.json();
    
    return data.results?.map((movie: TMDBMovie) => mapTMDBToContent(movie, 'movie')) || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function fetchTVShows(): Promise<Content[]> {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    const data = await response.json();
    
    return data.results?.map((show: TMDBTVShow) => mapTMDBToContent(show, 'tv')) || [];
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
}

export async function fetchKidsContent(): Promise<Content[]> {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=16&certification_country=US&certification.lte=PG&page=1`);
    const data = await response.json();
    
    return data.results?.map((movie: TMDBMovie) => mapTMDBToContent(movie, 'movie')) || [];
  } catch (error) {
    console.error('Error fetching kids content:', error);
    return [];
  }
}

export async function fetchDocumentaries(): Promise<Content[]> {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=99&page=1`);
    const data = await response.json();
    
    return data.results?.map((movie: TMDBMovie) => mapTMDBToContent(movie, 'movie')) || [];
  } catch (error) {
    console.error('Error fetching documentaries:', error);
    return [];
  }
}

export async function searchContent(query: string): Promise<Content[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`),
      fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`)
    ]);

    const moviesData = await moviesResponse.json();
    const tvData = await tvResponse.json();

    const movies = moviesData.results?.slice(0, 5).map((movie: TMDBMovie) => mapTMDBToContent(movie, 'movie')) || [];
    const tvShows = tvData.results?.slice(0, 5).map((show: TMDBTVShow) => mapTMDBToContent(show, 'tv')) || [];

    return [...movies, ...tvShows];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

export async function fetchContentById(id: string): Promise<Content | null> {
  try {
    // Intentar buscar como película primero
    const movieResponse = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`);
    if (movieResponse.ok) {
      const movie = await movieResponse.json();
      return mapTMDBToContent(movie, 'movie');
    }

    // Si no es película, buscar como serie
    const tvResponse = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=es-ES`);
    if (tvResponse.ok) {
      const tvShow = await tvResponse.json();
      return mapTMDBToContent(tvShow, 'tv');
    }

    return null;
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return null;
  }
}

export const categoryLabels = {
  movie: 'Películas',
  series: 'Series',
  kids: 'Infantil',
  documentary: 'Documentales'
};