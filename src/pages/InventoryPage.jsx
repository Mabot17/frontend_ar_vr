// src/pages/InventoryPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

const InventoryPage = () => {
  const navigate = useNavigate();
  const { player, fetchPlayer, loading } = useStore();

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1f2937'
      }}>
        <p style={{ color: 'white', fontSize: '20px' }}>Loading...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1f2937'
      }}>
        <p style={{ color: 'white' }}>Player data not found</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1f2937',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: '#374151',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 10px 0' }}>
            {player.username}'s Inventory
          </h1>
          <p style={{ color: '#9ca3af', margin: 0 }}>
            Level {player.level} | Total Cards: {player.owned_cards.length}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📷 Scan
          </button>
          <button
            onClick={() => navigate('/equip')}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ⚔️ Equip
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {player.owned_cards.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px',
            color: '#9ca3af'
          }}>
            <p style={{ fontSize: '18px' }}>No cards collected yet</p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Start Scanning
            </button>
          </div>
        ) : (
          player.owned_cards.map((cardId) => (
            <div
              key={cardId}
              style={{
                background: '#374151',
                borderRadius: '12px',
                padding: '15px',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '100%',
                height: '150px',
                background: '#4b5563',
                borderRadius: '8px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '48px' }}>🎴</span>
              </div>
              <h3 style={{ margin: '10px 0 5px 0', fontSize: '18px' }}>
                {cardId}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#9ca3af' 
              }}>
                Tap to view details
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryPage;