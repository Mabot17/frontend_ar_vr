// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8005'; // Sesuaikan dengan backend FastAPI

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Players
export const getPlayers = () => api.get('/players');
export const getPlayer = (userId) => api.get(`/players/${userId}`);
export const updatePlayer = (userId, data) => api.put(`/players/${userId}`, data);

// Weapons
export const getWeapons = () => api.get('/weapons');
export const getWeapon = (cardId) => api.get(`/weapons/${cardId}`);

// Armors
export const getArmors = () => api.get('/armors');
export const getArmor = (cardId) => api.get(`/armors/${cardId}`);

// Collect card (tambahkan ke inventory player)
export const collectCard = async (userId, cardId, cardType) => {
  const player = await getPlayer(userId);
  const playerData = player.data;
  
  // Cek apakah sudah punya
  if (!playerData.owned_cards.includes(cardId)) {
    playerData.owned_cards.push(cardId);
    return updatePlayer(userId, playerData);
  }
  
  return player;
};

// Equip card
export const equipCard = async (userId, cardId, slot) => {
  const player = await getPlayer(userId);
  const playerData = player.data;
  
  if (playerData.owned_cards.includes(cardId)) {
    playerData.equipped[slot] = cardId;
    return updatePlayer(userId, playerData);
  }
  
  throw new Error('Card not owned');
};