import React from 'react';
import './AdsBanner.css';

interface Ad {
  titulo: string;
  link: string;
  imagePath: string;
}

interface AdsBannerProps {
  ad: Ad;
}

/**
 * Card único de propaganda - renderiza como um card normal no grid
 */
const AdsBanner: React.FC<AdsBannerProps> = ({ ad }) => {
  /**
   * Handler de erro de imagem
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x150/FF8C42/FFFFFF?text=Patrocinador';
  };

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group-item ad-item"
      title={`Patrocinador: ${ad.titulo}`}
    >
      <div className="ad-badge">Patrocinador</div>
      <img
        src={ad.imagePath}
        alt={ad.titulo}
        className="ad-image"
        onError={handleImageError}
      />
      <h3>{ad.titulo}</h3>
      <p className="ad-description">Anúncio</p>
      <div className="ad-cta">
        Ver mais →
      </div>
    </a>
  );
};

export default React.memo(AdsBanner);
