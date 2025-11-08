import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrlKey = false,
  shiftKey = false,
  altKey = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrlKey, shiftKey, altKey]);
}

export const SHORTCUTS = {
  COMMAND_PALETTE: { key: 'k', ctrlKey: true },
  NEW_PAGE: { key: 'n', ctrlKey: true },
  SAVE: { key: 's', ctrlKey: true },
  BOLD: { key: 'b', ctrlKey: true },
  ITALIC: { key: 'i', ctrlKey: true },
  UNDERLINE: { key: 'u', ctrlKey: true },
} as const;
