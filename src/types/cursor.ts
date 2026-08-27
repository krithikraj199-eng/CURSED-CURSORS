export type LayerShapeType =
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'polygon'
  | 'star'
  | 'text'
  | 'emoji'
  | 'pixel'
  | 'line'
  | 'path'
  | 'image';

export type CursorType =
  | 'normal'
  | 'pointer'
  | 'text'
  | 'crosshair'
  | 'grab'
  | 'help'
  | 'wait'
  | 'custom';

export interface Point {
  x: number;
  y: number;
}

export interface PixelData {
  x: number;
  y: number;
  color: string;
}

export interface GlowEffect {
  enabled: boolean;
  color: string;
  blur: number;
  spread?: number;
  intensity?: number;
}

export interface ShadowEffect {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextData {
  text: string;
  fontSize: number;
  fontFamily?: string;
}

export interface EmojiData {
  char: string;
  size: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerShapeType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1

  // Spatial coordinates in 32x32 cursor space
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees

  // Shape specific properties
  borderRadius?: number;
  points?: Point[];
  pixels?: PixelData[];
  textData?: TextData;
  emojiData?: EmojiData;
  imageData?: { src: string; width?: number; height?: number };

  // Styling
  fill: string;
  stroke: string;
  strokeWidth: number;

  // Effects
  glow?: GlowEffect;
  shadow?: ShadowEffect;
}

export type CursorCategory =
  | 'All'
  | 'Anime'
  | 'Games'
  | 'Cute'
  | 'Cyber & Sci-Fi'
  | 'Memes'
  | 'Aesthetics'
  | 'Pixel'
  | 'Dark & Gothic'
  | 'Tech & OS';

export type CursorAnimationType =
  | 'float'
  | 'bounce'
  | 'sparkle'
  | 'pulse'
  | 'wiggle'
  | 'spin'
  | 'wave'
  | 'heartbeat'
  | 'rainbow';

export interface CursorProject {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  prompt?: string;
  cursorType: CursorType;
  layers: Layer[];
  pointerLayers?: Layer[];
  hotspot: Point;
  pointerHotspot?: Point;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author?: string;
  isFeatured?: boolean;
  isAnimated?: boolean;
  animationType?: CursorAnimationType;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  downloadsCount?: number;
  likesCount?: number;
  customScale?: number;
  customRotation?: number;
}

export type ThemeName =
  | 'sophisticated'
  | 'graphite'
  | 'dark'
  | 'light'
  | 'cloud'
  | 'sunset'
  | 'aurora'
  | 'cyberpunk'
  | 'pastel'
  | 'forest'
  | 'void'
  | 'frost'
  | 'ember'
  | 'neon'
  | 'bloom';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  primaryColor: string;
  accentColor: string;
  isDark: boolean;
  badge?: string;
}

