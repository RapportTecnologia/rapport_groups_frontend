import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Rapport Groups</h3>
          <p className="footer-description">
            Indexador de Grupos do WhatsApp
          </p>
          <p className="footer-copyright">
            © {currentYear} Rapport Tecnologia. Todos os direitos reservados.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contato</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:admin@rapport.tec.br" className="footer-link">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                admin@rapport.tec.br
              </a>
            </li>
            <li>
              <a href="https://wa.me/5585985205490" target="_blank" rel="noopener noreferrer" className="footer-link">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +55 (85) 98520-5490
              </a>
            </li>
            <li>
              <a href="https://rapport.tec.br" target="_blank" rel="noopener noreferrer" className="footer-link">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                rapport.tec.br
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Links Úteis</h4>
          <ul className="footer-links">
            <li>
              <a href="https://search.rapport.tec.br" target="_blank" rel="noopener noreferrer" className="footer-link">
                GenAI Search
              </a>
            </li>
            <li>
              <a href="https://rapport.tec.br" target="_blank" rel="noopener noreferrer" className="footer-link">
                Rapport Tecnologia
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Desenvolvido com ❤️ pela Rapport Tecnologia</p>
      </div>
    </footer>
  );
};

export default Footer;
