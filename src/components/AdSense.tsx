import React from 'react';

const AdSense: React.FC = () => {
  return (
    <div className="adsense-column">
      <h2>Publicidade</h2>
      {/* Placeholder para AdSense */}
      <div>
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-xxxxxxxxxxxx"
             data-ad-slot="xxxxxxxxxx"
             data-ad-format="auto"></ins>
      </div>
    </div>
  );
}

export default AdSense;
