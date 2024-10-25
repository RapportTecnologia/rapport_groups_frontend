import React from 'react';

const ScrollToTopButton: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button className="scroll-to-top" onClick={scrollToTop}>
      Voltar ao Início
    </button>
  );
}

export default ScrollToTopButton;
