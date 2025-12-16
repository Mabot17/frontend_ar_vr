// App.jsx
import React, { useState, useEffect } from 'react';
import { Camera, Package, Sparkles, Shield, Sword, User } from 'lucide-react';
import { Html5QrcodeScanner } from "html5-qrcode";
import './App.css';

const BARCODE_MAP = {
  '8991002101234': 'weapon_001',
  '8991002105678': 'armor_001',
  '8999999999999': 'char_001'
};


// Card Database
const CARD_DATABASE = {
  weapon_001: {
    card_id: 'weapon_001',
    name: 'Flame Sword',
    type_card: 'weapon',
    rarity: 'legendary',
    description: 'Pedang api legendaris dari gunung berapi',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/sword1/400/300'],
    meta: {
      power: 150,
      element: 'fire',
      level_required: 5,
      weapon_type: 'sword'
    }
  },
  weapon_002: {
    card_id: 'weapon_002',
    name: 'Ice Bow',
    type_card: 'weapon',
    rarity: 'epic',
    description: 'Busur es yang membekukan musuh',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/bow1/400/300'],
    meta: {
      power: 120,
      element: 'ice',
      level_required: 3,
      weapon_type: 'bow'
    }
  },
  armor_001: {
    card_id: 'armor_001',
    name: 'Dragon Scale Armor',
    type_card: 'armor',
    rarity: 'legendary',
    description: 'Armor dari sisik naga kuno',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/armor1/400/300'],
    meta: {
      defense: 200,
      element: 'fire',
      level_required: 5,
      armor_type: 'heavy'
    }
  },
  armor_002: {
    card_id: 'armor_002',
    name: 'Mystic Robe',
    type_card: 'armor',
    rarity: 'rare',
    description: 'Jubah penyihir mistis',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/armor2/400/300'],
    meta: {
      defense: 80,
      magic_defense: 150,
      element: 'arcane',
      level_required: 2,
      armor_type: 'light'
    }
  },
  char_001: {
    card_id: 'char_001',
    name: 'Fire Knight',
    type_card: 'char',
    rarity: 'legendary',
    description: 'Kesatria api yang gagah berani',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/char1/400/300'],
    meta: {
      hp: 1000,
      power: 100,
      defense: 80,
      element: 'fire',
      level: 1,
      equipable_weapon_types: ['sword', 'axe'],
      equipable_armor_types: ['heavy', 'medium']
    }
  },
  char_002: {
    card_id: 'char_002',
    name: 'Ice Mage',
    type_card: 'char',
    rarity: 'epic',
    description: 'Penyihir es yang powerful',
    trigger_type: '3d_model',
    link_card_image: ['https://picsum.photos/seed/char2/400/300'],
    meta: {
      hp: 600,
      power: 150,
      defense: 40,
      element: 'ice',
      level: 1,
      equipable_weapon_types: ['staff', 'bow'],
      equipable_armor_types: ['light', 'medium']
    }
  }
};

const TYPE_ICONS = {
  weapon: Sword,
  armor: Shield,
  char: User
};

function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [inventory, setInventory] = useState([]);
  const [scannedCard, setScannedCard] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [arEnabled, setArEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ar_inventory');
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading inventory:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (arEnabled && scannedCard) {
      loadARScripts();
    }
  }, [scannedCard]);

  const loadARScripts = () => {
    const injectScene = () => {
      const container = document.getElementById('ar-scene-container');
      if (!container) return;

      container.innerHTML = `
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false;"
          vr-mode-ui="enabled: false"
        >
          <a-marker preset="hiro">
            ${buildAREntity(scannedCard)}
          </a-marker>

          <a-entity camera></a-entity>
        </a-scene>
      `;
    };

    if (!window.AFRAME) {
      const aframeScript = document.createElement('script');
      aframeScript.src =
        'https://cdnjs.cloudflare.com/ajax/libs/aframe/1.4.2/aframe.min.js';
      aframeScript.onload = () => {
        const arScript = document.createElement('script');
        arScript.src =
          'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        arScript.onload = injectScene;
        document.head.appendChild(arScript);
      };
      document.head.appendChild(aframeScript);
    } else {
      injectScene();
    }
  };

  const saveInventory = (newInventory) => {
    localStorage.setItem('ar_inventory', JSON.stringify(newInventory));
    setInventory(newInventory);
  };

  const getRandomCard = () => {
    const cardIds = Object.keys(CARD_DATABASE);
    const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
    return CARD_DATABASE[randomId];
  };

  const handleScan = () => {
    const card = getRandomCard();
    const newItem = {
      ...card,
      id: Date.now(),
      obtained_at: new Date().toISOString()
    };
    
    setScannedCard(newItem);
    setShowReward(true);
    
    const newInventory = [...inventory, newItem];
    saveInventory(newInventory);
    
    setTimeout(() => {
      setShowReward(false);
      setScannedCard(null);
    }, 4000);
  };

  const handleBarcodeScan = (barcode) => {
    const cardId = BARCODE_MAP[barcode];

    if (!cardId) {
      alert('Barcode tidak terdaftar');
      return;
    }

    const card = CARD_DATABASE[cardId];

    const newItem = {
      ...card,
      id: Date.now(),
      obtained_at: new Date().toISOString(),
      barcode
    };

    setScannedCard(newItem);
    setShowReward(true);

    const newInventory = [...inventory, newItem];
    saveInventory(newInventory);

    setTimeout(() => {
      setShowReward(false);
    }, 4000);
  };


  const startAR = () => {
    setArEnabled(true);
  };

  const stopAR = () => {
    setArEnabled(false);
  };

  const BarcodeScanner = ({ onScan }) => {
    useEffect(() => {
      const scanner = new Html5QrcodeScanner(
        "barcode-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 150 }
        },
        false
      );

      scanner.render(
        (decodedText) => {
          onScan(decodedText);
          scanner.clear();
        },
        () => {}
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }, []);

    return <div id="barcode-reader" />;
  };

  const buildAREntity = (card) => {
    if (!card) return '';

    const color =
      card.rarity === 'legendary' ? 'gold' :
      card.rarity === 'epic' ? 'purple' :
      'blue';

    return `
      <a-box
        position="0 0.5 0"
        rotation="0 45 0"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 6000"
        material="color: ${color}; opacity: 0.85"
      ></a-box>

      <a-text
        value="${card.name}"
        position="0 1.2 0"
        align="center"
        width="3"
        color="white"
      ></a-text>
    `;
  };


  const renderScanner = () => {
    if (!arEnabled) {
      return (
        <div className="scanner-intro">
          <div className="intro-card">
            <Camera size={80} />
            <h2>AR Card Scanner</h2>
            <p>Scan objek di dunia nyata untuk mendapatkan equipment random!</p>
            <button onClick={startAR} className="btn-primary">
              Start AR Camera
            </button>
          </div>
          
          <div className="simulate-section">
            <p>Atau simulasi scan:</p>
            <button onClick={handleBarcodeScan} className="btn-secondary">
              🎲 Simulate Scan
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="ar-container">
        {/* A-Frame AR Scene will be injected here */}
        <div 
          id="ar-scene-container"
          dangerouslySetInnerHTML={{
            __html: `
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
                vr-mode-ui="enabled: false"
              >
                <a-marker type="pattern" preset="hiro">
                  <a-box position="0 0.5 0" material="color: red;"></a-box>
                  <a-text value="Scan detected!" position="0 1 0" align="center"></a-text>
                </a-marker>
                <a-entity camera></a-entity>
              </a-scene>
            `
          }}
        />
        
        <div className="ar-controls">
          <BarcodeScanner onScan={handleBarcodeScan} />

          <button onClick={handleScan} className="btn-secondary">
            🎲 Simulate Scan
          </button>

          <button onClick={stopAR} className="btn-stop">
            Stop AR
          </button>
        </div>

        {showReward && scannedCard && (
          <div className="reward-overlay">
            <div className="reward-card">
              <div className="reward-header">
                <Sparkles size={48} className="sparkle-icon" />
                <h3>Item Obtained!</h3>
              </div>
              
              <div className={`card-content rarity-${scannedCard.rarity}`}>
                <img 
                  src={scannedCard.link_card_image[0]} 
                  alt={scannedCard.name}
                />
                <div className="card-info">
                  <div className="card-title">
                    <h4>{scannedCard.name}</h4>
                    {React.createElement(TYPE_ICONS[scannedCard.type_card], { size: 24 })}
                  </div>
                  <p>{scannedCard.description}</p>
                  <div className="rarity-badge">{scannedCard.rarity}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInventory = () => {
    const groupedItems = inventory.reduce((acc, item) => {
      if (!acc[item.type_card]) acc[item.type_card] = [];
      acc[item.type_card].push(item);
      return acc;
    }, {});

    return (
      <div className="inventory-container">
        <div className="inventory-header">
          <h2>My Collection</h2>
          <p>Total Items: {inventory.length}</p>
        </div>

        {Object.keys(groupedItems).length === 0 ? (
          <div className="empty-inventory">
            <Package size={64} />
            <p>No items yet. Start scanning!</p>
          </div>
        ) : (
          <div className="inventory-content">
            {Object.keys(groupedItems).map(type => (
              <div key={type} className="inventory-section">
                <h3 className="section-title">
                  {React.createElement(TYPE_ICONS[type], { size: 20 })}
                  {type}s ({groupedItems[type].length})
                </h3>
                <div className="item-grid">
                  {groupedItems[type].map(item => (
                    <div key={item.id} className="item-card">
                      <div className={`item-rarity rarity-${item.rarity}`} />
                      <img src={item.link_card_image[0]} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <span className={`badge rarity-${item.rarity}`}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="content">
        {activeTab === 'scanner' ? renderScanner() : renderInventory()}
      </div>

      <div className="nav-bar">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`nav-btn ${activeTab === 'scanner' ? 'active' : ''}`}
        >
          <Camera size={24} />
          <span>Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        >
          <Package size={24} />
          <span>Inventory</span>
          {inventory.length > 0 && (
            <span className="badge-count">{inventory.length}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;