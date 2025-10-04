import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Função para rolar até o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Mostrar ou esconder o botão dependendo da rolagem
  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollY = window.pageYOffset;
      
      // Mostra o botão se rolou mais de 500px para baixo
      if (currentScrollY > 500) {
        // Se está rolando para cima (usuário quer voltar), mostra o botão
        if (currentScrollY < lastScrollY || currentScrollY > 800) {
          setIsVisible(true);
        }
      } else if (currentScrollY < 200) {
        // Só esconde quando chegar bem perto do topo
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [lastScrollY]);

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <svg
        className="scroll-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
