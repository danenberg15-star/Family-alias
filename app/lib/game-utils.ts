// app/lib/game-utils.ts
import { KIDS_WORDS } from "./words/kids";
import { JUNIOR_WORDS } from "./words/junior";
import { TEEN_WORDS } from "./words/teen";
import { ADULT_WORDS } from "./words/adult";

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const getInitialShuffledPools = () => ({
  KIDS: shuffleArray(KIDS_WORDS),
  JUNIOR: shuffleArray(JUNIOR_WORDS),
  TEEN: shuffleArray(TEEN_WORDS),
  ADULT: shuffleArray(ADULT_WORDS)
});