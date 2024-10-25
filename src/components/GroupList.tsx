import React, { useState, useEffect } from 'react';
import $ from 'jquery';

// Definindo a interface para o tipo de dado Group
interface Group {
  id: number;
  name: string;
  description: string;
  image: string | null; // Base64 da imagem ou null
  invitation_code: string; // Código de convite para o grupo
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    loadGroups(page);
  }, [page]);

  const loadGroups = (page: number) => {
    const apiUrl = process.env.REACT_APP_API_URL; // Obtém a URL da API do .env
    $.ajax({
      url: `${apiUrl}/groups?page=${page}`, // Usa a URL da API do .env
      method: 'GET',
      success: (data: { groups: Group[] }) => {
        setGroups(data.groups);
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="group-list">
      {groups.map((group) => (
        <div key={group.id} className="group-item">
          {/* Exibir a imagem apenas se estiver disponível */}
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
      <button className="next-page" onClick={handleNextPage}>Próxima Página</button>
    </div>
  );
}

export default GroupList;
