import { CategoryType, DifficultyLevel, HEBREW_ROOM_CODES, WordItem } from "../game.config";
import { WORD_DATABASE } from "./word-database";

export const generateRoomCode = (): string => {
  const codes = HEBREW_ROOM_CODES.filter(c => c !== "עומר");
  return codes[Math.floor(Math.random() * codes.length)];
};

export const getShuffledWords = (category: CategoryType, level: DifficultyLevel): WordItem[] => {
  let baseWords: WordItem[] = [];
  
  // שימוש ב-WORD_DATABASE המיובא מהקובץ הנכון
  if (level === "EASY") {
    baseWords = WORD_DATABASE["JUNIOR"];
  } else {
    baseWords = WORD_DATABASE[category];
  }

  const shuffled = [...baseWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};