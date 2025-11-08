export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const COLORS = {
  primary: '#4F46E5', // indigo-600
  accent: '#06B6D4', // cyan-500
  surface: {
    light: '#FFFFFF',
    dark: '#1E293B',
  },
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
  },
  text: {
    light: '#0F172A',
    dark: '#F8FAFC',
  },
  muted: '#E2E8F0',
} as const;

export const SHADOWS = {
  soft: '0 6px 24px rgba(15,23,42,0.06)',
} as const;

export const TRANSITIONS = {
  default: 'cubic-bezier(0.22, 1, 0.36, 1) 300ms',
  fast: 'cubic-bezier(0.22, 1, 0.36, 1) 200ms',
  slow: 'cubic-bezier(0.22, 1, 0.36, 1) 600ms',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const SIDEBAR_WIDTH = 260;
export const HEADER_HEIGHT = 64;

export const AUTOSAVE_DELAY = 2000; // 2 seconds

export const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  LIST: 'list',
  TODO: 'todo',
  IMAGE: 'image',
  CODE: 'code',
  QUOTE: 'quote',
  DIVIDER: 'divider',
} as const;

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];
