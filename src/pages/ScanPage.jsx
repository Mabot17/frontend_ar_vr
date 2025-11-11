// src/pages/ScanPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ARScene from '../components/ARScene';
import { useStore } from '../store/store';

const ScanPage = () => {
  const navigate = useNavigate();
  const { scannedCard, setScannedCard, collectScannedCard } = useStore();
  const [collecting, setCollecting] = useState(false);

  const handleCardDetected = (card) => {
    setScannedCard(card);
  };

  const handleCollect = async () => {
    setCollecting(true);
    const success = await collectScannedCard();
    setCollecting(false);
    
    if (success) {
      alert('Kartu berhasil dikumpulkan!');
      navigate('/inventory');
    } else {
      alert('Gagal mengumpulkan kartu');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ARScene onCardDetected={handleCardDetected} />
      
      {/* Collect Button */}
      {scannedCard && (
        <div style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <button
            onClick={handleCollect}
            disabled={collecting}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              background: collecting ? '#666' : '#10b981',
              border: 'none',
              borderRadius: '12px',
              cursor: collecting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {collecting ? 'Collecting...' : '📦 Collect Card'}
          </button>
        </div>
      )}

      {/* Card Info Panel */}
      {scannedCard && (
        <div style={{
          position: 'absolute',
          top: 80,
          right: 20,
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '300px',
          zIndex: 999
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fbbf24' }}>
            {scannedCard.name}
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Type:</strong> {scannedCard.type_card}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Rarity:</strong> <span style={{ color: '#a855f7' }}>{scannedCard.rarity}</span>
          </p>
          {scannedCard.meta && (
            <>
              {scannedCard.meta.power && (
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  ⚔️ Power: {scannedCard.meta.power}
                </p>
              )}
              {scannedCard.meta.element && (
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  🔥 Element: {scannedCard.meta.element}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000
      }}>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📦 Inventory
        </button>
      </div>
    </div>
  );
};

export default ScanPage;