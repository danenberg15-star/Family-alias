import { KIDS_LIST, JUNIOR_ONLY, TEEN_ONLY, ADULT_ONLY } from "./lib/word-database";

export type CategoryType = "KIDS" | "JUNIOR" | "TEEN" | "ADULT";
export type DifficultyLevel = "VARIABLE" | "EASY" | "MEDIUM" | "HARD";

export interface WordItem {
  word: string;
  en: string;
  img?: string;
}

// בניית מסד הנתונים לפי חוקי הירושה
export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_LIST,
  JUNIOR: [...KIDS_LIST, ...JUNIOR_ONLY],
  TEEN: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_ONLY],
  ADULT: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_ONLY, ...ADULT_ONLY]
};

// רשימת מילים בעברית לקוד החדר
export const HEBREW_ROOM_CODES = [
  "עומר", "אריה", "בלון", "גמל", "דוב", "הרים", "וילון", "זמיר", "חלוץ", "טירה", "יונה",
  "כדור", "לחם", "מפתח", "נחש", "סוס", "ענן", "פרח", "צפור", "קפה", "רכב",
  "שעון", "תמר", "בית", "גינה", "חלון", "סולם", "מתנה", "דגל", "שוקו"
];

/**
 * פונקציית ערבוב Fisher-Yates
 */
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