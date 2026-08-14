'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

export type CursorType = 'default' | 'button' | 'link' | 'card' | 'view' | 'text';

interface CursorContextType {
  cursorType: CursorType;
  cursorText: string;
  setCursor: (type: CursorType, text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: 'default',
  cursorText: '',
  setCursor: () => {},
  resetCursor: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [cursorText, setCursorText] = useState<string>('');

  const setCursor = useCallback((type: CursorType, text: string = '') => {
    setCursorType(type);
    setCursorText(text);
  }, []);

  const resetCursor = useCallback(() => {
    setCursorType('default');
    setCursorText('');
  }, []);

  // Global mouseover delegation for elements with data-cursor attributes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorEl) {
        const type = (cursorEl.getAttribute('data-cursor') || 'button') as CursorType;
        const text = cursorEl.getAttribute('data-cursor-text') || '';
        setCursor(type, text);
        return;
      }

      // Check standard interactive elements if not explicitly annotated
      const interactiveEl = target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]');
      if (interactiveEl) {
        setCursor('button');
        return;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor], a, button, input, [role="button"]');
      if (interactiveEl) {
        resetCursor();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [setCursor, resetCursor]);

  const value = useMemo(
    () => ({ cursorType, cursorText, setCursor, resetCursor }),
    [cursorType, cursorText, setCursor, resetCursor]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  return useContext(CursorContext);
}
