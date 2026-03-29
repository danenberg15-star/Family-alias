import { KIDS_LIST } from "./words/kids";
import { JUNIOR_ONLY } from "./words/junior";
import { TEEN_ONLY } from "./words/teen";
import { ADULT_ONLY } from "./words/adult";
import { WordItem, CategoryType } from "../game.config";

// הפיכת רשימות הטקסט (Strings) לאובייקטים של WordItem
const TEEN_MAP: WordItem[] = TEEN_ONLY.map(word => ({ word, en: "" }));
const ADULT_MAP: WordItem[] = ADULT_ONLY.map(word => ({ word, en: "" }));

// בניית המאגר המלא לפי חוקי הירושה:
// Kids = Kids
// Junior = Kids + Junior
// Teen = Kids + Junior + Teen
// Adult = Kids + Junior + Teen + Adult
export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_LIST,
  JUNIOR: [...KIDS_LIST, ...JUNIOR_ONLY],
  TEEN: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP],
  ADULT: [...KIDS_LIST, ...JUNIOR_ONLY, ...TEEN_MAP, ...ADULT_MAP]
};