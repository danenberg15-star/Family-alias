import { CategoryType, HEBREW_ROOM_CODES, WordItem } from "../game.config";
import { WORD_DATABASE } from "./word-database";

/**
 * הגרלת קוד חדר בעברית (למעט קוד ה-QA)
 */
export const generateRoomCode = (): string => {
  const codes = HEBREW_ROOM_CODES.filter(c => c !== "עומר");
  return codes[Math.floor(Math.random() * codes.length)];
};

/**
 * ערבוב מילים Fisher-Yates לפי קטגוריית גיל בלבד
 */
export const getShuffledWords = (category: CategoryType): WordItem[] => {
  // שליפת המילים מהמאגר שבנינו בשלב הקודם
  const baseWords = WORD_DATABASE[category];

  const shuffled = [...baseWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};