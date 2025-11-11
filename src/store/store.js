// src/store/store.js
import { create } from 'zustand';
import { 
  getPlayer, 
  collectCard, 
  equipCard, 
  unequipCard,
  getCardDetails,
  getOwnedCardsWithDetails,
  resetPlayer,
  getCardByMarker
} from '../services/localStorageService';

export const useStore = create((set, get) => ({
  // State
  player: null,
  scannedCard: null,
  loading: false,
  error: null,
  notification: null,

  // Actions
  fetchPlayer: () => {
    try {
      const player = getPlayer();
      set({ player, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  setScannedCard: (card) => {
    set({ scannedCard: card });
  },

  detectMarker: (markerType) => {
    const card = getCardByMarker(markerType);
    if (card) {
      set({ scannedCard: card });
      return card;
    }
    return null;
  },

  collectScannedCard: async () => {
    const { scannedCard } = get();
    if (!scannedCard) return { success: false, message: 'No card scanned' };

    set({ loading: true, error: null });
    try {
      const result = collectCard(scannedCard.card_id);
      
      if (result.success) {
        set({ 
          player: result.player, 
          loading: false,
          notification: {
            type: 'success',
            title: 'Card Collected!',
            message: `${scannedCard.name} (+${result.expGain} EXP)`,
            card: scannedCard
          }
        });
      } else {
        set({ 
          loading: false,
          notification: {
            type: 'info',
            title: 'Already Owned',
            message: result.message
          }
        });
      }
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        notification: {
          type: 'error',
          title: 'Error',
          message: error.message
        }
      });
      return { success: false, message: error.message };
    }
  },

  equipCardToSlot: async (cardId, slot) => {
    set({ loading: true, error: null });
    try {
      const result = equipCard(cardId, slot);
      set({ 
        player: result.player, 
        loading: false,
        notification: {
          type: 'success',
          title: 'Equipped!',
          message: `Card equipped to ${slot}`
        }
      });
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        notification: {
          type: 'error',
          title: 'Cannot Equip',
          message: error.message
        }
      });
      return { success: false, message: error.message };
    }
  },

  unequipCardFromSlot: async (slot) => {
    set({ loading: true, error: null });
    try {
      const result = unequipCard(slot);
      set({ 
        player: result.player, 
        loading: false,
        notification: {
          type: 'success',
          title: 'Unequipped',
          message: `${slot} slot cleared`
        }
      });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  getCardById: (cardId) => {
    return getCardDetails(cardId);
  },

  getOwnedCards: () => {
    return getOwnedCardsWithDetails();
  },

  clearScannedCard: () => {
    set({ scannedCard: null });
  },

  clearNotification: () => {
    set({ notification: null });
  },

  resetPlayerData: () => {
    const player = resetPlayer();
    set({ 
      player, 
      scannedCard: null, 
      error: null,
      notification: {
        type: 'info',
        title: 'Reset Complete',
        message: 'Player data has been reset'
      }
    });
  }
}));