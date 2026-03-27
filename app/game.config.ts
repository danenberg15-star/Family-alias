import { KIDS_WORDS } from "../data/words/kids";
import { JUNIOR_WORDS } from "../data/words/junior";
import { TEEN_WORDS } from "../data/words/teen";
import { ADULT_WORDS } from "../data/words/adult";

export const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: TEEN_WORDS,
  ADULT: ADULT_WORDS
};

export type CategoryType = keyof typeof WORD_DATABASE;