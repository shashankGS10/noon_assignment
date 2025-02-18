import { create } from 'zustand';

type Store = {
  level: number;
  remainingArrows: number;
  gameOver: boolean;
  resetGame: () => void;
  setLevel: (level: number) => void;
  setRemainingArrows: (remainingArrows: number) => void;
  setGameOver: (gameOver: boolean) => void;
};

export const useGameStore = create<Store>((set) => ({
  level: 1,
  remainingArrows: 5,
  gameOver: false,
  resetGame: () => set({ level: 1, remainingArrows: 5, gameOver: false }),
  setLevel: (level: number) => set({ level }),
  setRemainingArrows: (remainingArrows: number) => set({ remainingArrows }),
  setGameOver: (gameOver: boolean) => set({ gameOver }),
}));
