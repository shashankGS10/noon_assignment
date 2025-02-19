import { create } from "zustand";

const INITIAL_ARROWS = 10;

interface GameState {
  score: number;
  remainingArrows: number;
  arrows: any[];
  gameOver: boolean;
  addArrow: (arrow: any) => void;
  incrementScore: () => void;
  decrementArrows: () => void;
  setGameOver: (val: boolean) => void;
  reset: () => void;
}

const useGameStore = create<GameState>((set) => ({
    score: 0,
    remainingArrows: INITIAL_ARROWS,
    arrows: [],
    gameOver: false,
    addArrow: (arrow: any) =>
      set((state) => ({ arrows: [...state.arrows, arrow] })),
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    decrementArrows: () =>
      set((state) => ({ remainingArrows: state.remainingArrows - 1 })),
    setGameOver: (val) => set({ gameOver: val }),
    reset: () =>
      set({
        score: 0,
        remainingArrows: INITIAL_ARROWS,
        arrows: [],
        gameOver: false,
      }),
  }));

  export default useGameStore;