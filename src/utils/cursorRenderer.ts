import { Layer, Point } from '../types/cursor';

/**
 * Shared, unified cursor canvas renderer.
 * Operates conceptually on a 32x32 coordinate space, scaled to target width & height.
 */
export function renderCursorToCanvas(
  ctx: CanvasRenderingContext2D,
  layers: Layer[],
  targetWidth: number,
  targetHeight: number,
  clearCanvas = true
) {
  if (clearCanvas) {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  const scaleX = targetWidth / 32;
  const scaleY = targetHeight / 32;

  // Render bottom-to-top (first layer in array is bottom layer)
  for (const layer of layers) {
    if (!layer.visible) continue;

    ctx.save();

    // Set global opacity
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity ?? 1));

    // Calculate bounding box in target coordinates
    const lx = layer.x * scaleX;
    const ly = layer.y * scaleY;
    const lw = layer.width * scaleX;
    const lh = layer.height * scaleY;
    const cx = lx + lw / 2;
    const cy = ly + lh / 2;

    // Apply rotation around layer center if specified
    if (layer.rotation && layer.rotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Apply Shadow or Glow
    if (layer.glow && layer.glow.enabled) {
      ctx.shadowColor = layer.glow.color || '#00f0ff';
      ctx.shadowBlur = (layer.glow.blur || 4) * Math.max(scaleX, scaleY);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (layer.shadow && layer.shadow.enabled) {
      ctx.shadowColor = layer.shadow.color || 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = (layer.shadow.blur || 2) * Math.max(scaleX, scaleY);
      ctx.shadowOffsetX = (layer.shadow.offsetX || 1) * scaleX;
      ctx.shadowOffsetY = (layer.shadow.offsetY || 1) * scaleY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Prepare fill and stroke styles
    ctx.fillStyle = layer.fill || 'transparent';
    ctx.strokeStyle = layer.stroke || 'transparent';
    ctx.lineWidth = (layer.strokeWidth ?? 0) * scaleX;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw shape
    drawLayerShape(ctx, layer, lx, ly, lw, lh, scaleX, scaleY);

    ctx.restore();
  }
}

function drawLayerShape(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  x: number,
  y: number,
  w: number,
  h: number,
  scaleX: number,
  scaleY: number
) {
  const hasFill = layer.fill && layer.fill !== 'transparent' && layer.fill !== 'none';
  const hasStroke = layer.stroke && layer.stroke !== 'transparent' && (layer.strokeWidth ?? 0) > 0;

  switch (layer.type) {
    case 'rect': {
      const radius = (layer.borderRadius || 0) * scaleX;
      ctx.beginPath();
      if (radius > 0 && typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, radius);
      } else {
        ctx.rect(x, y, w, h);
      }
      if (hasFill) ctx.fill();
      if (hasStroke) ctx.stroke();
      break;
    }

    case 'circle': {
      ctx.beginPath();
      const rx = w / 2;
      const ry = h / 2;
      ctx.ellipse(x + rx, y + ry, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
      if (hasFill) ctx.fill();
      if (hasStroke) ctx.stroke();
      break;
    }

    case 'triangle': {
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      if (hasFill) ctx.fill();
      if (hasStroke) ctx.stroke();
      break;
    }

    case 'polygon': {
      const points = layer.points;
      if (points && points.length > 1) {
        ctx.beginPath();
        const first = points[0];
        ctx.moveTo(first.x * scaleX, first.y * scaleY);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
        }
        ctx.closePath();
        if (hasFill) ctx.fill();
        if (hasStroke) ctx.stroke();
      }
      break;
    }

    case 'star': {
      const spikes = 5;
      const outerRadius = Math.min(w, h) / 2;
      const innerRadius = outerRadius * 0.45;
      const cx = x + w / 2;
      const cy = y + h / 2;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        let px = cx + Math.cos(rot) * outerRadius;
        let py = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(px, py);
        rot += step;

        px = cx + Math.cos(rot) * innerRadius;
        py = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(px, py);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      if (hasFill) ctx.fill();
      if (hasStroke) ctx.stroke();
      break;
    }

    case 'pixel': {
      const pixels = layer.pixels;
      if (pixels && pixels.length > 0) {
        for (const px of pixels) {
          ctx.fillStyle = px.color;
          ctx.fillRect(px.x * scaleX, px.y * scaleY, scaleX, scaleY);
        }
      }
      break;
    }

    case 'line': {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
      break;
    }

    case 'text': {
      const text = layer.textData?.text || 'A';
      const fontSize = (layer.textData?.fontSize || 16) * scaleX;
      const fontFamily = layer.textData?.fontFamily || 'sans-serif';
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (hasFill) ctx.fillText(text, x + w / 2, y + h / 2);
      if (hasStroke) ctx.strokeText(text, x + w / 2, y + h / 2);
      break;
    }

    case 'emoji': {
      const char = layer.emojiData?.char || '✨';
      const size = (layer.emojiData?.size || 18) * scaleX;
      ctx.font = `${Math.round(size)}px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // If stroke is present, draw a smooth sticker outline behind emoji
      if (hasStroke) {
        ctx.save();
        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = (layer.strokeWidth || 2) * scaleX;
        ctx.strokeText(char, x + w / 2, y + h / 2);
        ctx.restore();
      }

      ctx.fillText(char, x + w / 2, y + h / 2);
      break;
    }

    case 'path': {
      // Path drawing support for custom vector shapes
      if (layer.points && layer.points.length > 0) {
        ctx.beginPath();
        const first = layer.points[0];
        ctx.moveTo(first.x * scaleX, first.y * scaleY);
        for (let i = 1; i < layer.points.length; i++) {
          ctx.lineTo(layer.points[i].x * scaleX, layer.points[i].y * scaleY);
        }
        if (hasFill) ctx.fill();
        if (hasStroke) ctx.stroke();
      }
      break;
    }

    case 'image': {
      if (layer.imageData?.src) {
        const img = new Image();
        img.src = layer.imageData.src;
        if (img.complete) {
          ctx.drawImage(img, x, y, w, h);
        }
      }
      break;
    }

    default:
      break;
  }
}

/**
 * Creates a Data URL of the cursor at the requested size (default 32x32).
 */
export function createCursorDataUrl(layers: Layer[], size = 32): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  renderCursorToCanvas(ctx, layers, size, size);
  return canvas.toDataURL('image/png');
}

/**
 * Generates raw ImageData at 32x32 resolution for binary encoding.
 */
export function createCursorImageData(layers: Layer[], width = 32, height = 32): ImageData | null {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  renderCursorToCanvas(ctx, layers, width, height);
  return ctx.getImageData(0, 0, width, height);
}

/**
 * Creates a PNG blob of the cursor at 32x32 resolution.
 */
export function createCursorBlob(layers: Layer[], size = 32): Promise<Blob | null> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }
    renderCursorToCanvas(ctx, layers, size, size);
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}

/**
 * Returns CSS cursor property string with embedded data URL and hotspot offset
 */
export function getCursorCssUrl(layers: Layer[], hotspot: Point = { x: 0, y: 0 }, size = 32): string {
  try {
    const dataUrl = createCursorDataUrl(layers, size);
    if (!dataUrl) return 'auto';
    const hx = Math.max(0, Math.min(size - 1, Math.round(hotspot.x * (size / 32))));
    const hy = Math.max(0, Math.min(size - 1, Math.round(hotspot.y * (size / 32))));
    return `url('${dataUrl}') ${hx} ${hy}, auto`;
  } catch {
    return 'auto';
  }
}

