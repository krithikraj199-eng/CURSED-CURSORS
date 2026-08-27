import fs from 'fs';

// Helper to format clean layers without halos
export function createPresetCode(varName, list) {
  return `import { CursorProject } from '../../types/cursor';

export const ${varName}: CursorProject[] = ${JSON.stringify(list, null, 2)};
`;
}
