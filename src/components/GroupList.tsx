import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import AddGroupForm from './AddGroupForm';
import AdSense from './AdSense';

interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null;
  invitation_code: string;
}

interface Category {
  id: number;
  name: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalGroups, setTotalGroups] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const groupsPerPage = 40;
  const totalPages = Math.ceil(totalGroups / groupsPerPage);

  useEffect(() => {
    fetchCategories();
    loadGroups(page, selectedCategory);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchGroups(searchTerm);
    } else {
      loadGroups(page, selectedCategory);
    }
  }, [searchTerm, page, selectedCategory]);

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

  const loadGroups = (page: number, categoryId: number | null = null) => {
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

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handlePageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(Number(event.target.value));
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

  return (
    <div className="app-container">
      <div className="main-column">
        <div className="filter-container">
          <div className="categories">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
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

        <AddGroupForm onGroupAdded={() => loadGroups(page, selectedCategory)} />

        {renderPaginationControls('top')}

        <div className="group-list">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="group-item">
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
            </div>
          ))
        ) : (
          <p>Nenhum grupo encontrado.</p>
        )}
      </div>

        {renderPaginationControls('bottom')}
      </div>

      <div className="ad-column">
        <AdSense />
      </div>
    </div>
  );
};

export default GroupList;
