import React, { useEffect, useRef } from 'react';

const ARScanner = ({ onMarkerFound, isActive }) => {
  const sceneRef = useRef(null);
  const markerFoundRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    let marker;
    let scene;

    const initAR = () => {
      scene = document.querySelector('a-scene');
      marker = document.querySelector('a-marker');

      if (marker) {
        marker.addEventListener('markerFound', handleMarkerFound);
        marker.addEventListener('markerLost', handleMarkerLost);
      }
    };

    const handleMarkerFound = () => {
      if (!markerFoundRef.current) {
        markerFoundRef.current = true;
        console.log('Marker detected!');
        if (onMarkerFound) {
          onMarkerFound();
        }
      }
    };

    const handleMarkerLost = () => {
      markerFoundRef.current = false;
      console.log('Marker lost');
    };

    // Wait for A-Frame to be loaded
    if (window.AFRAME) {
      setTimeout(initAR, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(initAR, 1000);
      });
    }

    return () => {
      if (marker) {
        marker.removeEventListener('markerFound', handleMarkerFound);
        marker.removeEventListener('markerLost', handleMarkerLost);
      }
    };
  }, [isActive, onMarkerFound]);

  if (!isActive) return null;

  return (
    <div ref={sceneRef} style={{ width: '100%', height: '100%' }}>
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
      >
        <a-marker type="pattern" preset="hiro">
          <a-box 
            position="0 0.5 0" 
            material="color: #FF6B6B;"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
          />
          <a-text 
            value="Scan Detected!" 
            position="0 1.2 0" 
            align="center"
            color="#FFFFFF"
            width="4"
          />
          <a-sphere
            position="0 0.5 0"
            radius="0.3"
            material="color: #4ECDC4; opacity: 0.5"
            animation="property: scale; to: 1.5 1.5 1.5; loop: true; dur: 1000; dir: alternate"
          />
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

export default ARScanner;