// src/pages/InventoryPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { useStore } from '../store/store';

const InventoryPage = () => {
  const navigate = useNavigate();
  const { player, fetchPlayer, getOwnedCards, getCardById } = useStore();
  const ownedCards = getOwnedCards();

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#a855f7';
      case 'rare': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'char': return '🧙';
      default: return '🎴';
    }
  };

  if (!player) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a'
      }}>
        <p style={{ color: 'white', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px'
    }}>
      <Notification />
      
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '28px' }}>
              {player.username}'s Collection
            </h1>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Level</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                  {player.level}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Total Cards</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {player.owned_cards.length}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Total Scans</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {player.stats.total_scans}
                </p>
              </div>
            </div>
            
            {/* EXP Bar */}
            <div style={{ marginTop: '16px', maxWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>EXP Progress</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {player.exp}/{player.level * 100}
                </span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                height: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(player.exp / (player.level * 100)) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              📷 Scan More
            </button>
            <button
              onClick={() => navigate('/equip')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ⚔️ Manage Equipment
            </button>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      {ownedCards.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '2px dashed rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
          <h2 style={{ color: 'white', marginBottom: '12px' }}>No Cards Yet</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '16px' }}>
            Start scanning markers to collect cards!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            📷 Start Scanning
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {ownedCards.map((card) => (
            <div
              key={card.card_id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                border: `2px solid ${getRarityColor(card.rarity)}`,
                boxShadow: `0 8px 24px ${getRarityColor(card.rarity)}33`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${getRarityColor(card.rarity)}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${getRarityColor(card.rarity)}33`;
              }}
            >
              {/* Rarity Badge */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: getRarityColor(card.rarity),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {card.rarity}
              </div>
              
              {/* Card Icon */}
              <div style={{
                width: '100%',
                height: '180px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {getTypeIcon(card.type_card)}
              </div>
              
              {/* Card Info */}
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px',
                color: getRarityColor(card.rarity),
                fontWeight: 'bold'
              }}>
                {card.name}
              </h3>
              
              <p style={{ 
                margin: '0 0 12px 0', 
                fontSize: '13px', 
                color: '#94a3b8',
                lineHeight: 1.5
              }}>
                {card.description}
              </p>
              
              {/* Stats */}
              {card.meta && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px'
                }}>
                  {card.meta.power && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Power</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                        ⚔️ {card.meta.power}
                      </p>
                    </div>
                  )}
                  {card.meta.defense && (
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Defense</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
                        🛡️ {card.meta.defense}
                      </p>
                    </div>
                  )}
                  {card.meta.element && (
                    <div style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      gridColumn: card.meta.power && card.meta.defense ? 'span 2' : 'auto'
                    }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Element</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#fbbf24', textTransform: 'capitalize' }}>
                        {card.meta.element}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;