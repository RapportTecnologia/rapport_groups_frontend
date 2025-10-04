import React from 'react';
import { Helmet } from 'react-helmet-async';
import GroupList from './components/GroupList';
import ScrollToTopButton from './components/ScrollToTopButton';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Rapport Groups</title>
        <meta name="description" content="Indexador de Grupos da Rapport Tecnologia, envie seu grupo para ser indexado." />
        <meta name="keywords" content="indice, indexador, index, grupo, whatsapp, divulgacao, diversos" />
        <script type="text/javascript">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/66d6862bea492f34bc0cfc26/1i6qvo6li';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </script>
      </Helmet>
      <div className="App">
        <div className="app-container">
          <GroupList />
        </div>
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default App;
