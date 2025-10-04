import { useState, useEffect } from 'react';

interface Ad {
  titulo: string;
  link: string;
  imagePath: string;
}

// Cache global de anúncios
let cachedAds: Ad[] | null = null;
let loadingPromise: Promise<Ad[]> | null = null;

/**
 * Hook para carregar anúncios uma única vez
 */
export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>(cachedAds || []);
  const [loading, setLoading] = useState<boolean>(cachedAds === null);

  useEffect(() => {
    // Se já tem cache, usa imediatamente
    if (cachedAds) {
      setAds(cachedAds);
      setLoading(false);
      return;
    }

    // Se já está carregando, aguarda a promise existente
    if (loadingPromise) {
      loadingPromise.then((data) => {
        setAds(data);
        setLoading(false);
      });
      return;
    }

    // Inicia novo carregamento
    loadingPromise = loadAds();
    loadingPromise.then((data) => {
      cachedAds = data;
      setAds(data);
      setLoading(false);
    });
  }, []);

  return { ads, loading };
};

/**
 * Carrega anúncios da API
 */
const loadAds = async (): Promise<Ad[]> => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://groups.rapport.tec.br/api';
    const response = await fetch(`${apiUrl}/ads?count=10`); // Carrega 10 anúncios
    
    if (!response.ok) {
      console.error('Erro ao carregar anúncios:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && data.data.ads && data.data.ads.length > 0) {
      console.log('✅ Anúncios carregados:', data.data.ads.length);
      return data.data.ads;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Erro ao carregar anúncios:', error);
    return [];
  }
};
