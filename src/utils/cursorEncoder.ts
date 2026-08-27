import { Point } from '../types/cursor';

/**
 * Encodes 32x32 ImageData into a valid binary Windows Cursor (.cur) file.
 * Reference: Windows ICO/CUR format specification.
 */
export function encodeWindowsCursor(imageData: ImageData, hotspot: Point): Uint8Array {
  const width = 32;
  const height = 32;

  // Clamp hotspot
  const hx = Math.max(0, Math.min(width - 1, Math.round(hotspot.x)));
  const hy = Math.max(0, Math.min(height - 1, Math.round(hotspot.y)));

  const xorSize = width * height * 4; // 4096 bytes (32bpp BGRA)
  const andRowBytes = 4; // 32 bits = 4 bytes per row
  const andSize = andRowBytes * height; // 128 bytes
  const bihSize = 40;
  const imageSize = bihSize + xorSize + andSize; // 4264 bytes
  const totalFileSize = 6 + 16 + imageSize; // 4286 bytes

  const buffer = new ArrayBuffer(totalFileSize);
  const view = new DataView(buffer);

  // 1. ICONDIR header (6 bytes)
  view.setUint16(0, 0, true); // idReserved = 0
  view.setUint16(2, 2, true); // idType = 2 (Cursor)
  view.setUint16(4, 1, true); // idCount = 1 image

  // 2. ICONDIRENTRY (16 bytes at offset 6)
  view.setUint8(6, width); // bWidth = 32
  view.setUint8(7, height); // bHeight = 32
  view.setUint8(8, 0); // bColorCount = 0
  view.setUint8(9, 0); // bReserved = 0
  view.setUint16(10, hx, true); // wXHotspot
  view.setUint16(12, hy, true); // wYHotspot
  view.setUint32(14, imageSize, true); // dwBytesInRes
  view.setUint32(18, 22, true); // dwImageOffset (6 + 16 = 22)

  // 3. BITMAPINFOHEADER (40 bytes at offset 22)
  let offset = 22;
  view.setUint32(offset + 0, bihSize, true); // biSize
  view.setInt32(offset + 4, width, true); // biWidth = 32
  view.setInt32(offset + 8, height * 2, true); // biHeight = 64 (XOR + AND)
  view.setUint16(offset + 12, 1, true); // biPlanes = 1
  view.setUint16(offset + 14, 32, true); // biBitCount = 32
  view.setUint32(offset + 16, 0, true); // biCompression = 0 (BI_RGB)
  view.setUint32(offset + 20, xorSize + andSize, true); // biSizeImage
  view.setInt32(offset + 24, 0, true); // biXPelsPerMeter
  view.setInt32(offset + 28, 0, true); // biYPelsPerMeter
  view.setUint32(offset + 32, 0, true); // biClrUsed
  view.setUint32(offset + 36, 0, true); // biClrImportant

  // 4. XOR Bitmap Data (32bpp BGRA, bottom-to-top)
  offset += bihSize; // offset = 62
  const src = imageData.data;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const r = src[srcIdx + 0];
      const g = src[srcIdx + 1];
      const b = src[srcIdx + 2];
      const a = src[srcIdx + 3];

      view.setUint8(offset++, b);
      view.setUint8(offset++, g);
      view.setUint8(offset++, r);
      view.setUint8(offset++, a);
    }
  }

  // 5. AND Mask (1 bit per pixel, bottom-to-top)
  // 1 = transparent, 0 = opaque
  for (let y = height - 1; y >= 0; y--) {
    let rowByte0 = 0;
    let rowByte1 = 0;
    let rowByte2 = 0;
    let rowByte3 = 0;

    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const a = src[srcIdx + 3];
      const isTransparent = a < 128 ? 1 : 0;

      const byteIdx = Math.floor(x / 8);
      const bitIdx = 7 - (x % 8);

      if (isTransparent) {
        if (byteIdx === 0) rowByte0 |= (1 << bitIdx);
        else if (byteIdx === 1) rowByte1 |= (1 << bitIdx);
        else if (byteIdx === 2) rowByte2 |= (1 << bitIdx);
        else if (byteIdx === 3) rowByte3 |= (1 << bitIdx);
      }
    }

    view.setUint8(offset++, rowByte0);
    view.setUint8(offset++, rowByte1);
    view.setUint8(offset++, rowByte2);
    view.setUint8(offset++, rowByte3);
  }

  return new Uint8Array(buffer);
}
