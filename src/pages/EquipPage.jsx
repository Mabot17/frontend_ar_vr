// src/pages/EquipPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { useStore } from '../store/store';

const EquipPage = () => {
  const navigate = useNavigate();
  const { player, fetchPlayer, equipCardToSlot, unequipCardFromSlot, getOwnedCards, getCardById } = useStore();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const ownedCards = getOwnedCards();

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const handleEquip = async (cardId) => {
    if (!selectedSlot) {
      alert('Pilih slot terlebih dahulu (char/weapon/armor)');
      return;
    }

    await equipCardToSlot(cardId, selectedSlot);
    setSelectedSlot(null);
  };

  const handleUnequip = async (slot) => {
    await unequipCardFromSlot(slot);
  };

  const getEquippedCard = (slot) => {
    if (!player || !player.equipped[slot]) return null;
    return getCardById(player.equipped[slot]);
  };

  const getFilteredCards = () => {
    if (!selectedSlot) return ownedCards;
    
    return ownedCards.filter(card => {
      if (selectedSlot === 'char') return card.type_card === 'char';
      if (selectedSlot === 'weapon') return card.type_card === 'weapon';
      if (selectedSlot === 'armor') return card.type_card === 'armor';
      return true;
    });
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#a855f7';
      case 'rare': return '#3b82f6';
      default: return '#6b7280';
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

  const filteredCards = getFilteredCards();

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
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
          ⚔️ Equipment Manager
        </h1>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back
        </button>
      </div>

      {/* Current Equipment */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ color: 'white', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
          Current Loadout
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {['char', 'weapon', 'armor'].map((slot) => {
            const equippedCard = getEquippedCard(slot);
            const isSelected = selectedSlot === slot;
            
            return (
              <div
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: '20px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : equippedCard 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: isSelected 
                    ? '2px solid #10b981' 
                    : equippedCard 
                    ? '2px solid rgba(16, 185, 129, 0.3)' 
                    : '2px solid transparent',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {slot === 'char' ? '🧙' : slot === 'weapon' ? '⚔️' : '🛡️'}
                </div>
                <h3 style={{ 
                  color: 'white', 
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>
                  {slot}
                </h3>
                
                {equippedCard ? (
                  <>
                    <p style={{ 
                      color: getRarityColor(equippedCard.rarity), 
                      margin: '0 0 8px 0',
                      fontSize: '15px',
                      fontWeight: 'bold'
                    }}>
                      {equippedCard.name}
                    </p>
                    <p style={{ 
                      color: '#94a3b8', 
                      margin: '0 0 12px 0',
                      fontSize: '12px'
                    }}>
                      {equippedCard.rarity} {equippedCard.type_card}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnequip(slot);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Unequip
                    </button>
                  </>
                ) : (
                  <p style={{ 
                    color: '#64748b', 
                    margin: 0,
                    fontSize: '13px'
                  }}>
                    Empty
                  </p>
                )}
                
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'white',
                    color: '#10b981',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    SELECTED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Cards */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>
            Available Cards
            {selectedSlot && (
              <span style={{ 
                color: '#10b981', 
                fontSize: '14px',
                marginLeft: '12px',
                fontWeight: 'normal'
              }}>
                (Click to equip to {selectedSlot})
              </span>
            )}
          </h2>
          
          {selectedSlot && (
            <button
              onClick={() => setSelectedSlot(null)}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Clear Selection
            </button>
          )}
        </div>
        
        {filteredCards.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '2px dashed rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '16px' }}>
              {selectedSlot 
                ? `No ${selectedSlot} cards available. Scan markers to collect!` 
                : 'No cards available. Start scanning!'}
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              📷 Scan Cards
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {filteredCards.map((card) => {
              const isEquipped = player.equipped.char === card.card_id || 
                                player.equipped.weapon === card.card_id || 
                                player.equipped.armor === card.card_id;
              
              return (
                <div
                  key={card.card_id}
                  onClick={() => !isEquipped && selectedSlot && handleEquip(card.card_id)}
                  style={{
                    background: isEquipped 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(255,255,255,0.05)',
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: selectedSlot && !isEquipped ? 'pointer' : 'default',
                    opacity: !selectedSlot || isEquipped ? 0.6 : 1,
                    transition: 'all 0.2s',
                    border: `2px solid ${isEquipped ? '#10b981' : getRarityColor(card.rarity)}`,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSlot && !isEquipped) e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSlot && !isEquipped) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {isEquipped && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      EQUIPPED
                    </div>
                  )}
                  
                  <div style={{
                    width: '100%',
                    height: '120px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    {card.type_card === 'weapon' ? '⚔️' : 
                     card.type_card === 'armor' ? '🛡️' : '🧙'}
                  </div>
                  
                  <p style={{ 
                    color: getRarityColor(card.rarity), 
                    margin: '0 0 4px 0',
                    fontSize: '15px',
                    fontWeight: 'bold'
                  }}>
                    {card.name}
                  </p>
                  
                  <p style={{ 
                    color: '#94a3b8', 
                    margin: 0,
                    fontSize: '12px'
                  }}>
                    {card.rarity} • {card.type_card}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipPage;