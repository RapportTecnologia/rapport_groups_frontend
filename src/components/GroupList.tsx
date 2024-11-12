import React, { useState, useEffect } from 'react';
import $ from 'jquery';

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
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');

  const groupsPerPage = 40;
  const totalPages = Math.ceil(totalGroups / groupsPerPage);

  useEffect(() => {
    fetchCategories();
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
        setCategories(data.categories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  };

  const loadGroups = (page: number, categoryId: number | null = null) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const categoryParam = categoryId ? `&category_id=${categoryId}` : '';
    $.ajax({
      url: `${apiUrl}/groups?page=${page}${categoryParam}`,
      method: 'GET',
      success: (data: { groups: Group[], total: number }) => {
        setGroups(data.groups);
        setTotalGroups(data.total);
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  };

  const searchGroups = (query: string) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/groups/search?query=${encodeURIComponent(query)}`,
      method: 'GET',
      success: (data: { groups: Group[], total: number }) => {
        setGroups(data.groups);
        setTotalGroups(data.total);
      },
      error: (err) => {
        console.error('Error searching groups:', err);
      }
    });
  };

  const handleAddGroup = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const invitationCode = inviteUrl.split('/').pop();

    $.ajax({
      url: `${apiUrl}/groups`,
      method: 'POST',
      data: JSON.stringify({
        invitation_code: invitationCode,
        description: groupDescription
      }),
      contentType: 'application/json',
      success: () => {
        alert('Grupo adicionado com sucesso!');
        setInviteUrl('');
        setGroupDescription('');
        loadGroups(page, selectedCategory);
      },
      error: (err) => {
        const errorMessage = err.responseJSON?.error || 'Erro ao adicionar o grupo.';
        alert(errorMessage);
      }
    });
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(1); // Resetar para a primeira página
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="group-list">
      {/* Botões de categorias */}
      <div className="category-buttons">
        <button onClick={() => handleCategorySelect(null)} className={selectedCategory === null ? 'selected' : ''}>
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={selectedCategory === category.id ? 'selected' : ''}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Campo de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar grupos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Formulário para adicionar novo grupo */}
      <div className="add-group-form">
        <input
          type="text"
          placeholder="URL de convite do WhatsApp"
          value={inviteUrl}
          onChange={(e) => setInviteUrl(e.target.value)}
          className="invite-url-input"
        />
        <textarea
          placeholder="Descrição do grupo"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          className="group-description-input"
        ></textarea>
        <button onClick={handleAddGroup}>Adicionar Grupo</button>
      </div>

      {/* Exibição do total de grupos e página atual */}
      <div className="pagination-info">
        <p>Total de grupos: {totalGroups}</p>
        <p>Página {page} de {totalPages}</p>
      </div>

      {/* Lista de grupos */}
      {groups.map((group) => (
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
      ))}

      <div className="pagination-controls">
        <button className="previous-page" onClick={handlePreviousPage} disabled={page === 1}>Página Anterior</button>
        <button className="next-page" onClick={handleNextPage} disabled={page >= totalPages}>Próxima Página</button>
      </div>
    </div>
  );
};

export default GroupList;
