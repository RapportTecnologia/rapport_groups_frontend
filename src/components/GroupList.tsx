import React, { useState, useEffect } from 'react';
import $ from 'jquery';

interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null;
  invitation_code: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');

  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchGroups(searchTerm);
    } else {
      loadGroups(page);
    }
  }, [searchTerm, page]);

  const loadGroups = (page: number) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    $.ajax({
      url: `${apiUrl}/groups?page=${page}`,
      method: 'GET',
      success: (data: { groups: Group[] }) => {
        setGroups(data.groups);
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
      success: (data: { groups: Group[] }) => {
        setGroups(data.groups);
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
        loadGroups(page);
      },
      error: (err) => {
        const errorMessage = err.responseJSON?.error || 'Erro ao adicionar o grupo.';
        alert(errorMessage);
      }
    });
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePreviousPage = () => setPage(page > 1 ? page - 1 : 1);

  return (
    <div className="group-list">
      <input
        type="text"
        placeholder="Pesquisar grupos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

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
        <button className="next-page" onClick={handleNextPage}>Próxima Página</button>
      </div>
    </div>
  );
};

export default GroupList;
