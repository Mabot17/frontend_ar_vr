// src/components/ARScene.jsx
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';

const ARScene = ({ onCardDetected }) => {
  const { scannedCard } = useStore();
  const sceneRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aframeScript, arScript;

    const loadScripts = async () => {
      try {
        // Load A-Frame first
        if (!document.querySelector('script[src*="aframe"]')) {
          aframeScript = document.createElement('script');
          aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
          document.head.appendChild(aframeScript);

          await new Promise((resolve, reject) => {
            aframeScript.onload = resolve;
            aframeScript.onerror = () => reject(new Error('Failed to load A-Frame'));
            setTimeout(() => reject(new Error('A-Frame load timeout')), 10000);
          });
        }

        // Then load AR.js
        if (!document.querySelector('script[src*="aframe-ar"]')) {
          arScript = document.createElement('script');
          arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
          document.head.appendChild(arScript);

          await new Promise((resolve, reject) => {
            arScript.onload = resolve;
            arScript.onerror = () => reject(new Error('Failed to load AR.js'));
            setTimeout(() => reject(new Error('AR.js load timeout')), 10000);
          });
        }

        console.log('✅ Scripts loaded successfully');
        setScriptsLoaded(true);
      } catch (err) {
        console.error('❌ Script loading error:', err);
        setError(err.message);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const handleMarkerFound = (evt) => {
      console.log('🎯 Marker detected!');
      
      const mockCard = {
        card_id: 'weapon_001',
        name: 'Excalibur Sword',
        type_card: 'weapon',
        rarity: 'legendary',
        trigger_type: '3d_model',
        link_card_image: ['https://picsum.photos/400/300'],
        meta: { power: 150, element: 'fire' }
      };
      
      if (onCardDetected) {
        onCardDetected(mockCard);
      }
    };

    const marker = document.querySelector('a-marker');
    if (marker) {
      marker.addEventListener('markerFound', handleMarkerFound);
      
      return () => {
        marker.removeEventListener('markerFound', handleMarkerFound);
      };
    }
  }, [scriptsLoaded, onCardDetected]);

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1f2937',
        color: 'white'
      }}>
        <h2 style={{ color: '#ef4444' }}>❌ Error Loading AR</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!scriptsLoaded) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1f2937',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #374151',
          borderTop: '5px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px' }}>Loading AR libraries...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <a-scene
        ref={sceneRef}
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
      >
        <a-marker preset="hiro" emitevents="true" id="main-marker">
          {scannedCard && scannedCard.trigger_type === '3d_model' && (
            <a-box position="0 0.5 0" material="color: red;" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"></a-box>
          )}
          {scannedCard && scannedCard.trigger_type === 'image' && (
            <a-plane 
              position="0 0 0" 
              rotation="-90 0 0" 
              width="1" 
              height="1"
              material={`src: ${scannedCard.link_card_image[0]}`}
            ></a-plane>
          )}
          {scannedCard && scannedCard.trigger_type === 'video' && (
            <a-video
              src={scannedCard.link_card_video[0]}
              width="1"
              height="1"
              position="0 0.1 0"
              rotation="-90 0 0"
            ></a-video>
          )}
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>

      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '8px',
        zIndex: 999
      }}>
        <p style={{ margin: 0 }}>📷 Arahkan kamera ke marker HIRO</p>
        {scannedCard && (
          <p style={{ color: '#4ade80', fontWeight: 'bold', margin: '5px 0 0 0' }}>
            ✓ Kartu terdeteksi: {scannedCard.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default ARScene;