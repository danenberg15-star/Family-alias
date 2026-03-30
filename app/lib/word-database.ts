// app/lib/word-database.ts
import { KIDS_WORDS } from "./words/kids";
import { JUNIOR_WORDS } from "./words/junior";
import { TEEN_WORDS } from "./words/teen";
import { ADULT_WORDS } from "./words/adult";
import { WordItem, CategoryType } from "../game.config";

export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_WORDS,
  JUNIOR: [...KIDS_WORDS, ...JUNIOR_WORDS],
  TEEN: [...KIDS_WORDS, ...JUNIOR_WORDS, ...TEEN_WORDS],
  ADULT: [...KIDS_WORDS, ...JUNIOR_WORDS, ...TEEN_WORDS, ...ADULT_WORDS]
};