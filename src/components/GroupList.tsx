import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import AddGroupForm from './AddGroupForm';
import Modal from './Modal';
import AdsBanner from './AdsBanner';

interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null;
  invitation_code: string;
  keywords: string; // Palavras-chave retornadas como string separada por vírgulas
}

interface Category {
  id: number;
  name: string;
}

interface Ad {
  titulo: string;
  link: string;
  imagePath: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalGroups, setTotalGroups] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ads, setAds] = useState<Ad[]>([]);

  const groupsPerPage = 40;
  const totalPages = Math.ceil(totalGroups / groupsPerPage);

  useEffect(() => {
    fetchCategories();
    loadGroups(page, selectedCategory);
    loadAds();
    registerServiceWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchGroups(searchTerm);
    } else {
      loadGroups(page, selectedCategory);
    }
  }, [searchTerm, page, selectedCategory, selectedKeyword]);

  const fetchCategories = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/categories`,
      method: 'GET',
      success: (data: { categories: Category[] }) => {
        setCategories(data.categories || []);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      },
    });
  };

  const loadAds = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/ads?count=10`,
      method: 'GET',
      success: (data: { success: boolean; data: { ads: Ad[] } }) => {
        if (data.success && data.data.ads) {
          setAds(data.data.ads);
          console.log('✅ Anúncios carregados:', data.data.ads.length);
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar anúncios:', err);
        setAds([]);
      },
    });
  };

  const loadGroups = (page: number, categoryId: number | null = null) => {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const categoryParam = categoryId ? `&category_id=${categoryId}` : '';
    $.ajax({
      url: `${apiUrl}/groups?page=${page}${categoryParam}`,
      method: 'GET',
      success: (data: { groups: Group[]; total: number }) => {
        setGroups(data.groups || []);
        setTotalGroups(data.total || 0);
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
        setGroups([]);
      },
      complete: () => {
        setIsLoading(false);
      }
    });
  };

  const searchGroups = (query: string) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/groups/search?query=${encodeURIComponent(query)}`,
      method: 'GET',
      success: (data: { groups: Group[]; total: number }) => {
        setGroups(data.groups || []);
        setTotalGroups(data.total || 0);
      },
      error: (err) => {
        console.error('Error searching groups:', err);
        setGroups([]);
      },
    });
  };

  const renderKeywords = (keywords: string | undefined) => {
    if (!keywords || keywords.trim() === '') {
      return null;
    }

    return keywords
      .split(',')
      .filter((keyword) => keyword.trim() !== '')
      .map((keyword, index) => (
        <span key={index} className="keyword-label" onClick={() => handleKeywordClick(keyword)}>
          {keyword}
        </span>
      ));
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedCategory(null);
    setSearchTerm('');
    setPage(1);

    searchGroupsByKeyword(keyword);
  };

  const searchGroupsByKeyword = (keyword: string) => {
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/groups/search?keyword=${encodeURIComponent(keyword)}`,
      method: 'GET',
      success: (data: { groups: Group[] }) => {
        setGroups(data.groups || []);
        setTotalGroups(data.groups.length || 0);
        setSelectedKeyword(keyword);
      },
      error: (err) => {
        console.error('Error searching groups by keyword:', err);
        setGroups([]);
      },
      complete: () => {
        setIsLoading(false);
      }
    });
  };

  const renderPaginationControls = (position: 'top' | 'bottom') => (
    <div className={`pagination-controls pagination-${position}`}>
      <button className="previous-page" onClick={handlePreviousPage} disabled={page === 1}>
        Página Anterior
      </button>
      <select className="page-select" value={page} onChange={handlePageSelect}>
        {Array.from({ length: totalPages }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Página {i + 1}
          </option>
        ))}
      </select>
      <button className="next-page" onClick={handleNextPage} disabled={page >= totalPages}>
        Próxima Página
      </button>
      <span className="total-groups">
        {`Exibindo ${groups.length} de ${totalGroups} grupos`}
      </span>
    </div>
  );

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handlePageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(Number(event.target.value));
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          },
          (error) => {
            console.error('Service Worker registration failed:', error);
          }
        );
      });
    }
  };

  return (
    <div className="app-container">
      <div className="main-column">
        <h1>Rapport Groups</h1>
        <p className="page-description">
          Bem-vindo ao Rapport Groups! Este espaço foi criado para conectar administradores de grupos com aqueles que estão procurando a comunidade perfeita para interagir. Divulgue seu grupo e ajude a formar conexões valiosas.
        </p>

        <div className="group-info">
          <p>Nosso grupo no WhatsApp: <a href="https://chat.whatsapp.com/LV9aswOWeiaJbX0z3kxQ9j" target="_blank" rel="noopener noreferrer">Clique aqui para acessar</a></p>
          <p>Você também pode enviar seu link de convite de grupo para o número: <a href="https://whatsa.me/5585991257722/?t=Cadastre%20meu%20grupo%20por%20favor%20na%20categoria%20%3Csubstitua%20pela%20categoria%3E,%20o%20link%20de%20convite%20%C3%A9%20%3Ccoloque%20aqui%20o%20link%20de%20convite%20do%20seu%20grupo%3E." target="_blank" rel="noopener noreferrer">+55 85 99125-7722</a></p>
        </div>

        <button className="add-group-button" onClick={() => setIsModalOpen(true)}>
          <svg className="button-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="button-text">Cadastrar Meu Grupo</span>
          <span className="button-badge">Grátis</span>
        </button>

        <div className="filter-container">
          <div className="categories">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedKeyword(null);
                    setSelectedCategory(category.id);
                  }}
                  className={selectedCategory === category.id ? 'selected' : ''}
                >
                  {category.name}
                </button>
              ))
            ) : (
              <p>Carregando categorias...</p>
            )}
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {renderPaginationControls('top')}

        <div className="loading-indicator" style={{ display: isLoading ? 'block' : 'none' }}>
          <p>Carregando...</p>
        </div>

        <div className="group-list">
          {groups && groups.length > 0 ? (
            groups.map((group, index) => (
              <React.Fragment key={group.id}>
                <div className="group-item">
                  {group.image ? (
                    <img src={`data:image/png;base64,${group.image}`} alt={group.name} />
                  ) : (
                    <div className="no-image-placeholder">Imagem não disponível</div>
                  )}
                  <h3>
                    <a href={`https://chat.whatsapp.com/${group.invitation_code}`} target="_blank" rel="noopener noreferrer">
                      {group.name}
                    </a>
                  </h3>
                  <p>{group.description}</p>
                  <div className="keywords-container">
                    {renderKeywords(group.keywords)}
                  </div>
                </div>
                
                {/* Insere anúncio a cada 6 grupos */}
                {(index + 1) % 6 === 0 && ads.length > 0 && (
                  <AdsBanner ad={ads[Math.floor(index / 6) % ads.length]} />
                )}
              </React.Fragment>
            ))
          ) : (
            !isLoading && <p>Nenhum grupo encontrado.</p>
          )}
        </div>

        {renderPaginationControls('bottom')}

        {/* Modal de Cadastro */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Cadastrar Novo Grupo"
        >
          <AddGroupForm 
            onGroupAdded={() => {
              loadGroups(page, selectedCategory);
              setIsModalOpen(false);
            }} 
          />
        </Modal>
      </div>
    </div>
  );
};

export default GroupList;
