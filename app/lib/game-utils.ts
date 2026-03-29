import { CategoryType, HEBREW_ROOM_CODES, WORD_DATABASE, WordItem } from "../game.config";

export const generateRoomCode = (): string => {
  const codes = HEBREW_ROOM_CODES.filter(c => c !== "עומר");
  return codes[Math.floor(Math.random() * codes.length)];
};

export const getShuffledWords = (category: CategoryType): WordItem[] => {
  const baseWords = WORD_DATABASE[category] || [];
  const shuffled = [...baseWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};