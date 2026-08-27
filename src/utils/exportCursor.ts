import JSZip from 'jszip';
import { CursorProject, Layer, Point } from '../types/cursor';
import { createCursorBlob, createCursorImageData } from './cursorRenderer';
import { encodeWindowsCursor } from './cursorEncoder';

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-|-$/g, '') || 'custom-cursor';
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportAsPng(project: CursorProject, type: 'cursor' | 'pointer' = 'cursor'): Promise<void> {
  const layers: Layer[] = type === 'pointer' && project.pointerLayers && project.pointerLayers.length > 0
    ? project.pointerLayers
    : project.layers;

  const blob = await createCursorBlob(layers, 32);
  if (!blob) throw new Error('Failed to generate PNG blob');
  const baseName = sanitizeFilename(project.title);
  triggerDownload(blob, `${baseName}-${type}.png`);
}

export async function exportAsCur(project: CursorProject, type: 'cursor' | 'pointer' = 'cursor'): Promise<void> {
  const layers: Layer[] = type === 'pointer' && project.pointerLayers && project.pointerLayers.length > 0
    ? project.pointerLayers
    : project.layers;
  const hotspot: Point = type === 'pointer' && project.pointerHotspot
    ? project.pointerHotspot
    : project.hotspot;

  const imageData = createCursorImageData(layers, 32, 32);
  if (!imageData) throw new Error('Failed to extract image data');
  const curBytes = encodeWindowsCursor(imageData, hotspot);
  const blob = new Blob([curBytes], { type: 'application/octet-stream' });
  const baseName = sanitizeFilename(project.title);
  triggerDownload(blob, `${baseName}-${type}.cur`);
}

export async function exportAsRoblox(project: CursorProject): Promise<void> {
  const zip = new JSZip();
  const baseName = sanitizeFilename(project.title);

  // 1. Roblox ArrowFarCursor (Main Arrow)
  const cursorBlob = await createCursorBlob(project.layers, 64);
  if (cursorBlob) {
    zip.file('ArrowFarCursor.png', cursorBlob);
  }

  // 2. Roblox ArrowCursor (Hover pointer)
  const pointerLayers = project.pointerLayers && project.pointerLayers.length > 0
    ? project.pointerLayers
    : project.layers;
  const pointerBlob = await createCursorBlob(pointerLayers, 64);
  if (pointerBlob) {
    zip.file('ArrowCursor.png', pointerBlob);
  }

  // Roblox installation guide
  const robloxReadme = `=====================================================
  ROBLOX CUSTOM CURSOR PACK: ${project.title}
=====================================================

HOW TO INSTALL CUSTOM CURSORS IN ROBLOX:
1. Press Windows Key + R on your keyboard.
2. Paste this directory path into the Run prompt and press Enter:
   %localappdata%\\Roblox\\Versions

3. Open the folder with the latest version code (e.g. version-xxxxxxxxxxxxxxxx).
4. Navigate deeper to:
   content > textures > Cursors > KeyboardMouse

5. Back up your existing "ArrowFarCursor.png" and "ArrowCursor.png" (optional).
6. Copy the "ArrowFarCursor.png" and "ArrowCursor.png" from this zip and replace them.
7. Launch Roblox — your new cursor will appear in all Roblox games!

Note: Roblox resets textures on game updates, so keep this zip file to reapply.
`;
  zip.file('ROBLOX_INSTRUCTIONS.txt', robloxReadme);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(zipBlob, `${baseName}-roblox-pack.zip`);
}

export async function exportAsZip(project: CursorProject): Promise<void> {
  const zip = new JSZip();
  const baseName = sanitizeFilename(project.title);

  const pointerLayers = project.pointerLayers && project.pointerLayers.length > 0
    ? project.pointerLayers
    : project.layers;
  const pointerHotspot = project.pointerHotspot || { x: 4, y: 2 };

  // 1. Primary Cursor PNGs (32x32 & 64x64 HD)
  const png32 = await createCursorBlob(project.layers, 32);
  if (png32) zip.file(`${baseName}-cursor.png`, png32);

  const png64 = await createCursorBlob(project.layers, 64);
  if (png64) zip.file(`${baseName}-cursor-hd.png`, png64);

  // 2. Hover Pointer PNGs (32x32 & 64x64 HD)
  const pointer32 = await createCursorBlob(pointerLayers, 32);
  if (pointer32) zip.file(`${baseName}-pointer.png`, pointer32);

  const pointer64 = await createCursorBlob(pointerLayers, 64);
  if (pointer64) zip.file(`${baseName}-pointer-hd.png`, pointer64);

  // 3. CUR Windows Binaries with exact Hotspots
  const cursorImageData = createCursorImageData(project.layers, 32, 32);
  if (cursorImageData) {
    const curBytes = encodeWindowsCursor(cursorImageData, project.hotspot);
    zip.file(`${baseName}-cursor.cur`, curBytes);
  }

  const pointerImageData = createCursorImageData(pointerLayers, 32, 32);
  if (pointerImageData) {
    const pointerCurBytes = encodeWindowsCursor(pointerImageData, pointerHotspot);
    zip.file(`${baseName}-pointer.cur`, pointerCurBytes);
  }

  // 4. Roblox Folder
  const robloxFolder = zip.folder('roblox');
  if (robloxFolder) {
    if (png64) robloxFolder.file('ArrowFarCursor.png', png64);
    if (pointer64) robloxFolder.file('ArrowCursor.png', pointer64);
  }

  // 5. Complete README.txt
  const readmeText = `=====================================================
  SWEEZY CURSORS / CURSED CURSORS COMPOSITION PACK
=====================================================
Cursor Title: ${project.title}
Category: ${project.category || 'General'}
Tags: ${project.tags.join(', ')}
Hotspot (Normal): (${project.hotspot.x}, ${project.hotspot.y})
Hotspot (Pointer): (${pointerHotspot.x}, ${pointerHotspot.y})

PACKAGE CONTENTS:
-----------------------------------------------------
- ${baseName}-cursor.cur    -> Windows Normal Cursor (Hotspot: ${project.hotspot.x}, ${project.hotspot.y})
- ${baseName}-pointer.cur   -> Windows Link Select Cursor (Hotspot: ${pointerHotspot.x}, ${pointerHotspot.y})
- ${baseName}-cursor.png    -> 32x32 Standard Cursor PNG
- ${baseName}-pointer.png   -> 32x32 Standard Pointer PNG
- ${baseName}-cursor-hd.png -> 64x64 HD Cursor PNG
- ${baseName}-pointer-hd.png-> 64x64 HD Pointer PNG
- roblox/                   -> Pre-formatted Roblox replacement assets

=====================================================
1. WINDOWS 10 / 11 INSTALLATION GUIDE
=====================================================
1. Extract all files to a permanent directory on your PC (e.g. C:\\Cursors\\).
2. Open Windows Settings:
   - Windows 11: Settings > Bluetooth & devices > Mouse > Additional mouse settings
   - Windows 10: Settings > Devices > Mouse > Additional mouse options
3. Go to the "Pointers" tab.
4. Select "Normal Select", click "Browse...", and choose "${baseName}-cursor.cur".
5. Select "Link Select", click "Browse...", and choose "${baseName}-pointer.cur".
6. Click "Save As..." to name your scheme, then click "Apply" and "OK".

=====================================================
2. ROBLOX INSTALLATION GUIDE
=====================================================
1. Press Win + R and enter: %localappdata%\\Roblox\\Versions
2. Open the newest version folder -> content -> textures -> Cursors -> KeyboardMouse
3. Copy the files from the "roblox/" folder inside this zip to replace ArrowFarCursor and ArrowCursor.

Thank you for creating with Cursed Cursors Studio!
`;

  zip.file('README.txt', readmeText);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(zipBlob, `${baseName}-complete-pack.zip`);
}

