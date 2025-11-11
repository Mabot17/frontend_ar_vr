// src/components/ARSceneCustomMarker.jsx
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';

const ARSceneCustomMarker = ({ onCardDetected }) => {
  const { scannedCard } = useStore();
  const sceneRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aframeScript, arScript;

    const loadScripts = async () => {
      try {
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

    const waitForMarkers = setInterval(() => {
      const markers = document.querySelectorAll('a-marker');
      const scene = document.querySelector('a-scene');
      
      if (markers.length > 0 && scene && scene.hasLoaded) {
        clearInterval(waitForMarkers);
        console.log('✅ Scene and markers ready!');
        
        markers.forEach((marker, index) => {
          const markerType = marker.getAttribute('type') || marker.getAttribute('preset');
          
          const handleMarkerFound = (evt) => {
            console.log(`🎯 Marker detected: ${markerType}`);
            
            // Mapping marker ke card_id
            const cardMapping = {
              'hiro': 'weapon_001',
              'pattern-marker1': 'weapon_002', // Custom marker 1
              'pattern-marker2': 'armor_001',  // Custom marker 2
              'kanji': 'char_001'
            };
            
            const cardId = cardMapping[markerType] || 'weapon_001';
            
            const mockCard = {
              card_id: cardId,
              name: `Card from ${markerType}`,
              type_card: cardId.includes('weapon') ? 'weapon' : cardId.includes('armor') ? 'armor' : 'char',
              rarity: 'legendary',
              trigger_type: '3d_model',
              link_card_image: ['https://picsum.photos/400/300'],
              meta: { 
                power: 150 + (index * 10), 
                element: 'fire',
                marker_source: markerType 
              }
            };
            
            if (onCardDetected) {
              onCardDetected(mockCard);
            }
          };

          const handleMarkerLost = (evt) => {
            console.log(`❌ Marker lost: ${markerType}`);
          };

          marker.addEventListener('markerFound', handleMarkerFound);
          marker.addEventListener('markerLost', handleMarkerLost);
        });
      }
    }, 100);

    return () => {
      clearInterval(waitForMarkers);
    };
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
        arjs="sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix;"
        vr-mode-ui="enabled: false"
      >
        {/* Marker 1: HIRO (Default) */}
        <a-marker preset="hiro" emitevents="true" id="marker-hiro">
          <a-box 
            position="0 0.5 0" 
            material="color: #10b981;" 
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"
          ></a-box>
          <a-text value="WEAPON" position="0 1 0" align="center" color="#ffffff"></a-text>
        </a-marker>

        {/* Marker 2: Custom Pattern (Upload file .patt) */}
        <a-marker 
          type="pattern" 
          url="/markers/custom-marker-1.patt" 
          emitevents="true"
          id="marker-custom1"
        >
          <a-sphere 
            position="0 0.5 0" 
            radius="0.5"
            material="color: #ef4444;" 
            animation="property: position; to: 0 1 0; dir: alternate; loop: true; dur: 1000"
          ></a-sphere>
          <a-text value="ARMOR" position="0 1.5 0" align="center" color="#ffffff"></a-text>
        </a-marker>

        {/* Marker 3: Kanji Preset */}
        <a-marker preset="kanji" emitevents="true" id="marker-kanji">
          <a-cylinder
            position="0 0.5 0"
            radius="0.3"
            height="1"
            material="color: #3b82f6;"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
          ></a-cylinder>
          <a-text value="CHARACTER" position="0 1.2 0" align="center" color="#ffffff"></a-text>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        color: 'white',
        background: 'rgba(0,0,0,0.85)',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 999,
        fontSize: '13px'
      }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>
          📷 Multi-Marker AR Scanner
        </p>
        <p style={{ margin: '5px 0', fontSize: '11px', color: '#9ca3af' }}>
          • HIRO marker → Weapon 🗡️<br/>
          • Custom marker → Armor 🛡️<br/>
          • Kanji marker → Character 🧙<br/>
          • Scan objek fisik dengan marker!
        </p>
        {scannedCard && (
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '4px',
            border: '1px solid #10b981'
          }}>
            <p style={{ 
              color: '#10b981', 
              fontWeight: 'bold', 
              margin: 0
            }}>
              ✓ {scannedCard.name}
            </p>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '11px',
              margin: '5px 0 0 0'
            }}>
              Type: {scannedCard.type_card} | Power: {scannedCard.meta.power}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARSceneCustomMarker;