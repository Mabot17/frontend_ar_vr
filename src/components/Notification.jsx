// src/components/Notification.jsx
import { useEffect } from 'react';
import { useStore } from '../store/store';

const Notification = () => {
  const { notification, clearNotification } = useStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      background: bgColors[notification.type] || '#374151',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      minWidth: '300px',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
            {notification.title}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            {notification.message}
          </p>
          
          {notification.card && (
            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#4b5563',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {notification.card.type_card === 'weapon' ? '⚔️' : 
                 notification.card.type_card === 'armor' ? '🛡️' : '🧙'}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
                  {notification.card.name}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.8 }}>
                  {notification.card.rarity} • {notification.card.type_card}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={clearNotification}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 0 0 10px',
            opacity: 0.7
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          ×
        </button>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;