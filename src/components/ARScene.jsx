// src/components/ARScene.jsx
import { useEffect } from 'react';
import { useStore } from '../store/store';

const ARScene = ({ onCardDetected }) => {
  const { scannedCard } = useStore();

  useEffect(() => {
    // Load A-Frame dan AR.js via CDN
    if (!document.querySelector('script[src*="aframe"]')) {
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      document.head.appendChild(aframeScript);

      aframeScript.onload = () => {
        const arScript = document.createElement('script');
        arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        document.head.appendChild(arScript);
      };
    }

    // Register marker detection event
    const handleMarkerFound = (evt) => {
      const markerId = evt.target.getAttribute('value');
      console.log('Marker detected:', markerId);
      
      // Simulate fetch card data (ganti dengan API call sebenarnya)
      const mockCard = {
        card_id: markerId || 'weapon_001',
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

    // Setup event listener
    window.addEventListener('markerFound', handleMarkerFound);

    return () => {
      window.removeEventListener('markerFound', handleMarkerFound);
    };
  }, [onCardDetected]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
      >
        <a-marker preset="hiro" emitevents="true">
          {scannedCard && scannedCard.trigger_type === '3d_model' && (
            <a-box position="0 0.5 0" material="color: red;"></a-box>
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
        <p>Arahkan kamera ke marker HIRO</p>
        {scannedCard && (
          <p style={{ color: '#4ade80', fontWeight: 'bold' }}>
            ✓ Kartu terdeteksi: {scannedCard.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default ARScene;