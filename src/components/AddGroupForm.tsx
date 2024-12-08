import React, { useState, useEffect } from 'react';
import $ from 'jquery';

interface AddGroupFormProps {
  onGroupAdded: () => void;
}

interface Category {
  id: number;
  name: string;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onGroupAdded }) => {
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+55'); // Default: Brasil
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const countryCodes = [
    { code: '+1', flag: '🇺🇸', short: 'US' }, // EUA
    { code: '+44', flag: '🇬🇧', short: 'UK' }, // Reino Unido
    { code: '+55', flag: '🇧🇷', short: 'BR' }, // Brasil
    { code: '+244', flag: '🇦🇴', short: 'AO' }, // Angola
    { code: '+238', flag: '🇨🇻', short: 'CV' }, // Cabo Verde
    { code: '+853', flag: '🇲🇴', short: 'MO' }, // Macau
    { code: '+351', flag: '🇵🇹', short: 'PT' }, // Portugal
    { code: '+258', flag: '🇲🇿', short: 'MZ' }, // Moçambique
    { code: '+239', flag: '🇸🇹', short: 'ST' }, // São Tomé e Príncipe
    { code: '+853', flag: '🇬🇼', short: 'GW' }, // Guiné-Bissau
    { code: '+240', flag: '🇬🇶', short: 'GQ' }, // Guiné Equatorial
    { code: '+91', flag: '🇮🇳', short: 'IN' }, // Índia
    { code: '+81', flag: '🇯🇵', short: 'JP' }, // Japão
    // Adicione mais países conforme necessário
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const validatePhone = (phone: string): boolean => {
    const regex = /^\d{9,15}$/; // Validação genérica: 9-15 dígitos
    return regex.test(phone);
  };

  const handleAddGroup = () => {
    if (!validatePhone(phone)) {
      alert('Número de telefone inválido. Por favor, insira apenas números, sem espaços ou caracteres especiais.');
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL;
    const invitationCode = inviteUrl.split('/').pop();

    $.ajax({
      url: `${apiUrl}/groups`,
      method: 'POST',
      data: JSON.stringify({
        name: groupName,
        phone: `${countryCode}${phone}`,
        invitation_code: invitationCode,
        description: groupDescription,
        category_id: selectedCategory,
        origin: window.location.host, // Domínio do frontend
      }),
      contentType: 'application/json',
      success: () => {
        alert('Grupo adicionado com sucesso!');
        setInviteUrl('');
        setGroupDescription('');
        setGroupName('');
        setPhone('');
        setSelectedCategory(null);
        onGroupAdded();
      },
      error: (err) => {
        const errorMessage = err.responseJSON?.error || 'Erro ao adicionar o grupo.';
        alert(errorMessage);
      }
    });
  };

  return (
    <div className="add-group-form">
      <input
        type="text"
        placeholder="Nome do Grupo"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="group-name-input"
      />
      <div className="phone-container">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="country-code-select"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.short} ({country.code})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="phone-input"
          title="Telefone de quem cadastra o grupo ou do Administrador"
        />
      </div>
      <div className="category-container">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="category-select styled-select"
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
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
  );
};

export default AddGroupForm;
