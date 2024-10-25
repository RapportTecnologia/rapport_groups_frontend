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
  const [hasMoreGroups, setHasMoreGroups] = useState<boolean>(true); // Para verificar se há mais páginas

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
        // Verifica se há mais grupos para a próxima página
        if (data.groups.length < 40) {
          setHasMoreGroups(false); // Se menos de 40 grupos forem retornados, não há mais páginas
        } else {
          setHasMoreGroups(true); // Caso contrário, ainda há mais páginas para navegar
        }
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
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

      <div className="pagination-controls">
        {/* Botão para página anterior, desabilitado se for a primeira página */}
        <button 
          className="previous-page" 
          onClick={handlePreviousPage} 
          disabled={page === 1}>
          Página Anterior
        </button>

        {/* Botão para próxima página, desabilitado se não houver mais páginas */}
        <button 
          className="next-page" 
          onClick={handleNextPage} 
          disabled={!hasMoreGroups}>
          Próxima Página
        </button>
      </div>
    </div>
  );
}

export default GroupList;
