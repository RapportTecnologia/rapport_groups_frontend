import React, { useEffect } from 'react';

// Adicionando a definição para `adsbygoogle` no objeto `window`
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSense: React.FC = () => {
  useEffect(() => {
    // Recarregar o script do AdSense após o componente ser montado
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="adsense-container">
      <h3 className="adsense-title">Publicidade</h3>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // Substitua pelo seu ID do AdSense
        data-ad-slot="1234567890" // Substitua pelo slot do anúncio
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSense;
