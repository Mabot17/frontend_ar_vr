// src/store/store.js
import { create } from 'zustand';
import { getPlayer, collectCard, equipCard } from '../services/api';

export const useStore = create((set, get) => ({
  // State
  userId: 'USR-001', // Hardcode dulu untuk testing
  player: null,
  scannedCard: null,
  loading: false,
  error: null,

  // Actions
  fetchPlayer: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getPlayer(get().userId);
      set({ player: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setScannedCard: (card) => {
    set({ scannedCard: card });
  },

  collectScannedCard: async () => {
    const { scannedCard, userId } = get();
    if (!scannedCard) return;

    set({ loading: true, error: null });
    try {
      await collectCard(userId, scannedCard.card_id, scannedCard.type_card);
      await get().fetchPlayer(); // Refresh player data
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  equipCardToSlot: async (cardId, slot) => {
    const { userId } = get();
    set({ loading: true, error: null });
    try {
      await equipCard(userId, cardId, slot);
      await get().fetchPlayer(); // Refresh player data
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  clearScannedCard: () => {
    set({ scannedCard: null });
  },
}));