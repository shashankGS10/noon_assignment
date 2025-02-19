import { create } from "zustand";

const INITIAL_ARROWS = 5;
const INITIAL_ROTATION_SPEED = 4000;
const MIN_ROTATION_SPEED = 2000; // Ensuring minimum threshold to avoid excessive slowdown

interface GameState {
  score: number;
  remainingArrows: number;
  arrows: number[];
  gameOver: boolean;
  level: number;
  rotationSpeed: number;
  highScore: number;
  addArrow: (arrow: number) => void;
  incrementScore: () => void;
  decrementArrows: () => void;
  setGameOver: (val: boolean) => void;
  nextLevel: () => void;
  updateHighScore: (score: number) => void;
  reset: () => void;
}

const generateRandomArrows = (count: number): number[] => {
  const randomAngles = new Set<number>();
  while (randomAngles.size < count) {
    randomAngles.add(Math.floor(Math.random() * 360));
  }
  return Array.from(randomAngles);
};

const useGameStore = create<GameState>((set, get) => ({
    score: 0,
    remainingArrows: INITIAL_ARROWS,
    arrows: generateRandomArrows(2),
    gameOver: false,
    level: 1,
    rotationSpeed: INITIAL_ROTATION_SPEED,
    highScore: 0,

    addArrow: (arrow: number) =>
        set((state) => ({ arrows: [...state.arrows, arrow] })),

    incrementScore: () =>
        set((state) => ({ score: state.score + 1 })),

    decrementArrows: () =>
        set((state) => ({ remainingArrows: state.remainingArrows - 1 })),

    setGameOver: (val) => {
        set({ gameOver: val });
        if (val) {
            set({
                score: 0,
                remainingArrows: INITIAL_ARROWS,
                arrows: generateRandomArrows(2),
                level: 1,
                rotationSpeed: INITIAL_ROTATION_SPEED,
            });
        }
    },

    updateHighScore: (score) =>
        set((state) => ({ highScore: Math.max(state.highScore, score) })),

    nextLevel: () => {
        const { level, rotationSpeed } = get();
        set({
            level: level + 1,
            remainingArrows: INITIAL_ARROWS + level * 2,
            arrows: generateRandomArrows(2 + level),
            gameOver: false,
            rotationSpeed: Math.max(MIN_ROTATION_SPEED, rotationSpeed - 500),
        });
    },
      reset: () => {
        const { highScore } = get();
        set({
            score: 0,
            remainingArrows: INITIAL_ARROWS,
            arrows: generateRandomArrows(2),
            gameOver: false,
            level: 1,
            rotationSpeed: INITIAL_ROTATION_SPEED,
            highScore,
        });
    },
}));

export default useGameStore;


