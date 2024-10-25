import React from 'react';
import GroupList from './components/GroupList';
import AdSense from './components/AdSense';
import ScrollToTopButton from './components/ScrollToTopButton';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="main-content">
        <GroupList />
        <ScrollToTopButton />
      </div>
      <AdSense />
    </div>
  );
}

export default App;
