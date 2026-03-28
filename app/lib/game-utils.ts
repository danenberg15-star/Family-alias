import { WordItem, CategoryType, DifficultyLevel, WORD_DATABASE, HEBREW_ROOM_CODES } from "../game.config";

export const generateRoomCode = (): string => {
  const codes = HEBREW_ROOM_CODES.filter(c => c !== "עומר");
  return codes[Math.floor(Math.random() * codes.length)];
};

export const getShuffledWords = (category: CategoryType, level: DifficultyLevel): WordItem[] => {
  let baseWords: WordItem[] = [];
  if (level === "EASY") baseWords = WORD_DATABASE["JUNIOR"];
  else if (level === "MEDIUM") baseWords = WORD_DATABASE["TEEN"];
  else if (level === "HARD") baseWords = WORD_DATABASE["ADULT"];
  else baseWords = WORD_DATABASE[category];

  const shuffled = [...baseWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};