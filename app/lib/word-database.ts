import { KIDS_LIST } from "./words/kids";
import { JUNIOR_ONLY } from "./words/junior";
import { TEEN_ONLY } from "./words/teen";
import { ADULT_ONLY } from "./words/adult";
import { WordItem, CategoryType } from "../game.config";

const TEEN_MAP: WordItem[] = TEEN_ONLY.map(w => ({ word: w, en: "" }));
const ADULT_MAP: WordItem[] = ADULT_ONLY.map(w => ({ word: w, en: "" }));

export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_LIST,
  JUNIOR: [...KIDS_LIST, ...JUNIOR_ONLY],
  TEEN: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP],
  ADULT: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP, ...ADULT_MAP]
};