// app/lib/word-database.ts
import { KIDS_WORDS } from "./words/kids";
import { JUNIOR_WORDS } from "./words/junior";
import { TEEN_WORDS } from "./words/teen";
import { ADULT_WORDS } from "./words/adult";
import { WordItem, CategoryType } from "../game.config";

export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_WORDS,
  JUNIOR: [...KIDS_WORDS, ...JUNIOR_WORDS],
  // רשימת הנוער תכיל את כל 500 המילים שנטען בצעד הבא
  TEEN: TEEN_WORDS,
  // רשימת המבוגרים תורכב מ-250 המילים הראשונות של הנוער + 250 המילים של המבוגרים
  ADULT: [...TEEN_WORDS.slice(0, 250), ...ADULT_WORDS.slice(0, 250)]
};