import { KIDS_LIST, JUNIOR_ONLY, TEEN_ONLY, ADULT_ONLY } from "./lib/word-database";

export type CategoryType = "KIDS" | "JUNIOR" | "TEEN" | "ADULT";
export type DifficultyLevel = "VARIABLE" | "EASY" | "MEDIUM" | "HARD";

export interface WordItem {
  word: string;
  en: string;
  img?: string;
}

// בניית מסד הנתונים
const TEEN_MAP: WordItem[] = TEEN_ONLY.map(w => ({ word: w, en: "" }));
const ADULT_MAP: WordItem[] = ADULT_ONLY.map(w => ({ word: w, en: "" }));

export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_LIST,
  JUNIOR: [...KIDS_LIST, ...JUNIOR_ONLY],
  TEEN: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP],
  ADULT: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP, ...ADULT_MAP]
};

export const HEBREW_ROOM_CODES = [
  "עומר", "אריה", "בלון", "גמל", "דוב", "הרים", "וילון", "זמיר", "חלוץ", "טירה", "יונה",
  "כדור", "לחם", "מפתח", "נחש", "סוס", "ענן", "פרח", "צפור", "קפה", "רכב"
];