// src/pages/EquipPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

const EquipPage = () => {
  const navigate = useNavigate();
  const { player, fetchPlayer, equipCardToSlot, loading } = useStore();
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const handleEquip = async (cardId) => {
    if (!selectedSlot) {
      alert('Pilih slot terlebih dahulu (char/weapon/armor)');
      return;
    }

    const success = await equipCardToSlot(cardId, selectedSlot);
    if (success) {
      alert(`Card equipped to ${selectedSlot}!`);
      setSelectedSlot(null);
    } else {
      alert('Failed to equip card');
    }
  };

  if (loading || !player) {
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
        <h1 style={{ color: 'white', margin: 0 }}>
          ⚔️ Equipment Manager
        </h1>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '10px 20px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      {/* Current Equipment */}
      <div style={{
        background: '#374151',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: 'white', marginTop: 0 }}>Current Equipment</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {['char', 'weapon', 'armor'].map((slot) => (
            <div
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              style={{
                padding: '20px',
                background: selectedSlot === slot ? '#10b981' : '#4b5563',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedSlot === slot ? '3px solid #34d399' : 'none'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {slot === 'char' ? '🧙' : slot === 'weapon' ? '⚔️' : '🛡️'}
              </div>
              <h3 style={{ 
                color: 'white', 
                margin: '0 0 5px 0',
                textTransform: 'uppercase'
              }}>
                {slot}
              </h3>
              <p style={{ 
                color: '#d1d5db', 
                margin: 0,
                fontSize: '14px'
              }}>
                {player.equipped[slot] || 'Empty'}
              </p>
              {selectedSlot === slot && (
                <p style={{
                  color: '#34d399',
                  margin: '10px 0 0 0',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ✓ Selected
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Cards */}
      <div style={{
        background: '#374151',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h2 style={{ color: 'white', marginTop: 0 }}>
          Available Cards
          {selectedSlot && (
            <span style={{ 
              color: '#10b981', 
              fontSize: '16px',
              marginLeft: '10px'
            }}>
              (Select card to equip to {selectedSlot})
            </span>
          )}
        </h2>
        
        {player.owned_cards.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
            No cards available. Scan some cards first!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {player.owned_cards.map((cardId) => (
              <div
                key={cardId}
                onClick={() => handleEquip(cardId)}
                style={{
                  background: '#4b5563',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: selectedSlot ? 'pointer' : 'not-allowed',
                  opacity: selectedSlot ? 1 : 0.5,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedSlot) e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (selectedSlot) e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '120px',
                  background: '#6b7280',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '36px' }}>🎴</span>
                </div>
                <p style={{ 
                  color: 'white', 
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {cardId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipPage;