import React, { useState, useEffect } from 'react';
import './AdsBanner.css';

interface Ad {
  titulo: string;
  link: string;
  imagePath: string;
}

interface AdsBannerProps {
  count?: number;
}

/**
 * Banner de Propagandas
 */
const AdsBanner: React.FC<AdsBannerProps> = ({ count = 2 }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Carrega propagandas ao montar o componente
   */
  useEffect(() => {
    loadAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Busca propagandas da API PHP
   */
  const loadAds = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost/api';
      const response = await fetch(`${apiUrl}/ads?count=${count}`);
      const data = await response.json();
      
      if (data.success && data.data.ads) {
        setAds(data.data.ads);
      }
    } catch (error) {
      console.error('Erro ao carregar propagandas:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler de erro de imagem
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x150/FF8C42/FFFFFF?text=Imagem+Indisponível';
  };

  if (loading) {
    return (
      <div className="ads-banner">
        <h3 className="ads-title">Patrocinadores</h3>
        <div className="ads-grid">
          {[1, 2].map((i) => (
            <div key={i} className="ad-card loading">
              <div className="ad-card-title loading-shimmer"></div>
              <div className="ad-card-image loading-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ads-banner">
      <h3 className="ads-title">Patrocinadores</h3>
      {ads.length === 0 ? (
        <div className="ads-empty">
          <p>Nenhuma propaganda disponível no momento</p>
        </div>
      ) : (
        <div className="ads-grid">
          {ads.map((ad, index) => (
            <a
              key={index}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ad-card"
            >
              <div className="ad-card-header">
                <h4 className="ad-card-title">{ad.titulo}</h4>
                <span className="ad-card-icon">↗</span>
              </div>
              <div className="ad-card-image-wrapper">
                <img
                  src={ad.imagePath}
                  alt={ad.titulo}
                  className="ad-card-image"
                  onError={handleImageError}
                />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsBanner;
