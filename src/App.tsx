import React from 'react';
import GroupList from './components/GroupList';
import AdSense from './components/AdSense';
import ScrollToTopButton from './components/ScrollToTopButton';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="content-wrapper">
        {/* Listagem de grupos no centro */}
        <GroupList />

        {/* Área de publicidade à direita */}
        <AdSense />
      </div>
      
      {/* Botão para retornar ao topo */}
      <ScrollToTopButton />
    </div>
  );
}

export default App;
