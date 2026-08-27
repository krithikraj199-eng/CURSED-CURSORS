import { CursorProject } from '../../types/cursor';
import { GAME_CURSORS } from './gameCursors';
import { ANIME_CURSORS } from './animeCursors';
import { CUTE_CURSORS } from './cuteCursors';
import { MEME_CURSORS } from './memeCursors';
import { CYBER_CURSORS } from './cyberCursors';
import { AESTHETIC_CURSORS } from './aestheticCursors';
import { TECH_CURSORS } from './techCursors';

export {
  GAME_CURSORS,
  ANIME_CURSORS,
  CUTE_CURSORS,
  MEME_CURSORS,
  CYBER_CURSORS,
  AESTHETIC_CURSORS,
  TECH_CURSORS,
};

// 70 Curated Gallery Cursors (10 per category)
export const ALL_CATEGORY_CURSORS: CursorProject[] = [
  ...GAME_CURSORS,
  ...ANIME_CURSORS,
  ...CUTE_CURSORS,
  ...MEME_CURSORS,
  ...CYBER_CURSORS,
  ...AESTHETIC_CURSORS,
  ...TECH_CURSORS,
];
