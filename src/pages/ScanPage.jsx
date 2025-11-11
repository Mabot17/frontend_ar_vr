// src/pages/ScanPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ARScene from '../components/ARScene';
import Notification from '../components/Notification';
import { useStore } from '../store/store';

const ScanPage = () => {
  const navigate = useNavigate();
  const { scannedCard, setScannedCard, collectScannedCard, fetchPlayer, player } = useStore();
  const [collecting, setCollecting] = useState(false);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const handleCardDetected = (card) => {
    setScannedCard(card);
  };

  const handleCollect = async () => {
    setCollecting(true);
    const result = await collectScannedCard();
    setCollecting(false);
    
    if (result.success) {
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ARScene onCardDetected={handleCardDetected} />
      <Notification />
      
      {/* Player Stats - Top Left */}
      {player && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '10px',
          zIndex: 998,
          minWidth: '180px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
            {player.username}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
            Level {player.level} • {player.owned_cards.length} Cards
          </p>
          <div style={{
            marginTop: '8px',
            background: '#374151',
            borderRadius: '4px',
            height: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(player.exp / (player.level * 100)) * 100}%`,
              height: '100%',
              background: '#10b981',
              transition: 'width 0.3s'
            }}></div>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#9ca3af' }}>
            {player.exp}/{player.level * 100} EXP
          </p>
        </div>
      )}
      
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
              padding: '18px 50px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              background: collecting ? '#6b7280' : 
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: collecting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              if (!collecting) e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              if (!collecting) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '24px' }}>📦</span>
            {collecting ? 'Collecting...' : 'Collect Card'}
          </button>
        </div>
      )}

      {/* Card Info Panel */}
      {scannedCard && (
        <div style={{
          position: 'absolute',
          bottom: 120,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          maxWidth: '350px',
          width: '90%',
          zIndex: 999,
          border: '2px solid ' + (
            scannedCard.rarity === 'legendary' ? '#fbbf24' :
            scannedCard.rarity === 'epic' ? '#a855f7' :
            scannedCard.rarity === 'rare' ? '#3b82f6' : '#6b7280'
          )
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#4b5563',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              {scannedCard.type_card === 'weapon' ? '⚔️' : 
               scannedCard.type_card === 'armor' ? '🛡️' : '🧙'}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '18px',
                color: scannedCard.rarity === 'legendary' ? '#fbbf24' :
                       scannedCard.rarity === 'epic' ? '#a855f7' :
                       scannedCard.rarity === 'rare' ? '#3b82f6' : '#d1d5db'
              }}>
                {scannedCard.name}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                {scannedCard.rarity.toUpperCase()} • {scannedCard.type_card.toUpperCase()}
              </p>
            </div>
          </div>
          
          <p style={{ margin: '12px 0', fontSize: '13px', color: '#d1d5db', lineHeight: 1.5 }}>
            {scannedCard.description}
          </p>
          
          {scannedCard.meta && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginTop: '12px'
            }}>
              {scannedCard.meta.power && (
                <div style={{ background: '#374151', padding: '8px', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Power</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                    ⚔️ {scannedCard.meta.power}
                  </p>
                </div>
              )}
              {scannedCard.meta.defense && (
                <div style={{ background: '#374151', padding: '8px', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Defense</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
                    🛡️ {scannedCard.meta.defense}
                  </p>
                </div>
              )}
              {scannedCard.meta.element && (
                <div style={{ background: '#374151', padding: '8px', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>Element</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#fbbf24', textTransform: 'capitalize' }}>
                    {scannedCard.meta.element}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '12px 18px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
          }}
        >
          📦 Inventory
        </button>
      </div>
    </div>
  );
};

export default ScanPage;