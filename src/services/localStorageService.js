// src/services/localStorageService.js

// Card Database - Semua kartu yang tersedia
export const CARD_DATABASE = {
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

// Marker to Card Mapping
export const MARKER_TO_CARD = {
  'hiro': 'weapon_001',
  'kanji': 'char_001',
  'pattern-marker1': 'weapon_002',
  'pattern-marker2': 'armor_001',
  'barcode-5': 'armor_002',
  'barcode-6': 'char_002'
};

// Initialize default player
const DEFAULT_PLAYER = {
  user_id: 'player_001',
  username: 'Player',
  level: 1,
  exp: 0,
  owned_cards: [],
  equipped: {
    char: null,
    weapon: null,
    armor: null
  },
  stats: {
    total_scans: 0,
    cards_collected: 0
  }
};

// Local Storage Keys
const STORAGE_KEYS = {
  PLAYER: 'xr_card_player',
  SETTINGS: 'xr_card_settings'
};

// Player Management
export const getPlayer = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYER);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize new player
  savePlayer(DEFAULT_PLAYER);
  return DEFAULT_PLAYER;
};

export const savePlayer = (playerData) => {
  localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(playerData));
  return playerData;
};

export const updatePlayer = (updates) => {
  const player = getPlayer();
  const updated = { ...player, ...updates };
  return savePlayer(updated);
};

// Card Management
export const collectCard = (cardId) => {
  const player = getPlayer();
  
  // Check if card exists in database
  if (!CARD_DATABASE[cardId]) {
    throw new Error('Card not found in database');
  }
  
  // Check if already owned
  if (player.owned_cards.includes(cardId)) {
    return { success: false, message: 'Card already owned', player };
  }
  
  // Add to owned cards
  player.owned_cards.push(cardId);
  player.stats.cards_collected += 1;
  player.stats.total_scans += 1;
  
  // Add EXP
  const card = CARD_DATABASE[cardId];
  const expGain = card.rarity === 'legendary' ? 100 : card.rarity === 'epic' ? 50 : 25;
  player.exp += expGain;
  
  // Level up check
  const expNeeded = player.level * 100;
  if (player.exp >= expNeeded) {
    player.level += 1;
    player.exp = player.exp - expNeeded;
  }
  
  savePlayer(player);
  return { success: true, message: 'Card collected!', player, expGain };
};

export const equipCard = (cardId, slot) => {
  const player = getPlayer();
  const card = CARD_DATABASE[cardId];
  
  if (!card) {
    throw new Error('Card not found');
  }
  
  if (!player.owned_cards.includes(cardId)) {
    throw new Error('Card not owned');
  }
  
  // Validation based on slot
  if (slot === 'char' && card.type_card !== 'char') {
    throw new Error('Only character cards can be equipped in char slot');
  }
  
  if (slot === 'weapon' && card.type_card !== 'weapon') {
    throw new Error('Only weapon cards can be equipped in weapon slot');
  }
  
  if (slot === 'armor' && card.type_card !== 'armor') {
    throw new Error('Only armor cards can be equipped in armor slot');
  }
  
  // Check level requirement
  if (card.meta.level_required && player.level < card.meta.level_required) {
    throw new Error(`Level ${card.meta.level_required} required`);
  }
  
  // Check compatibility (weapon/armor with char)
  if (slot === 'weapon' || slot === 'armor') {
    const equippedChar = player.equipped.char;
    if (equippedChar) {
      const charCard = CARD_DATABASE[equippedChar];
      if (slot === 'weapon') {
        const weaponType = card.meta.weapon_type;
        if (!charCard.meta.equipable_weapon_types.includes(weaponType)) {
          throw new Error(`${charCard.name} cannot equip ${weaponType} type weapons`);
        }
      }
      if (slot === 'armor') {
        const armorType = card.meta.armor_type;
        if (!charCard.meta.equipable_armor_types.includes(armorType)) {
          throw new Error(`${charCard.name} cannot equip ${armorType} type armor`);
        }
      }
    }
  }
  
  player.equipped[slot] = cardId;
  savePlayer(player);
  return { success: true, player };
};

export const unequipCard = (slot) => {
  const player = getPlayer();
  player.equipped[slot] = null;
  savePlayer(player);
  return { success: true, player };
};

// Get card details
export const getCardDetails = (cardId) => {
  return CARD_DATABASE[cardId] || null;
};

// Get all owned cards with details
export const getOwnedCardsWithDetails = () => {
  const player = getPlayer();
  return player.owned_cards.map(cardId => CARD_DATABASE[cardId]).filter(Boolean);
};

// Reset player (for testing)
export const resetPlayer = () => {
  localStorage.removeItem(STORAGE_KEYS.PLAYER);
  return getPlayer();
};

// Get card by marker
export const getCardByMarker = (markerType) => {
  const cardId = MARKER_TO_CARD[markerType];
  return cardId ? CARD_DATABASE[cardId] : null;
};