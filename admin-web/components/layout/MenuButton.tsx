'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './MenuButton.module.css';

type MenuButtonProps = {
  id: string;
  // Renders the button that opens the menu. It receives the props the button needs.
  renderButton: (props: {
    id: string;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  }) => ReactNode;
  // Panel contents. It must include one element with id={menuId} and role="menu" that holds
  // the role="menuitemradio" choices; any other text sits outside that element.
  children: (helpers: { menuId: string; close: (returnFocus: boolean) => void }) => ReactNode;
};

// A button that opens a small menu panel, shared by the Theme menu and the profile menu.
// Keyboard: Enter, Space or an arrow key opens it on the checked choice; arrow keys,
// Home and End move; Escape closes and returns focus; Tab closes. A click outside closes.
export function MenuButton({ id, renderButton, children }: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  const items = () => [...(wrapRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];

  useEffect(() => {
    if (!open) return;
    (items().find((item) => item.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) document.getElementById(buttonId)?.focus();
  };

  const onPanelKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => {
      event.preventDefault();
      list[(to + list.length) % list.length]?.focus();
    };
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') move(index + 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') move(index - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(list.length - 1);
    else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') close(false);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {renderButton({
        id: buttonId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
        onClick: () => setOpen(!open),
        onKeyDown: (event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
          }
        },
      })}
      <div className={styles.panel} hidden={!open} onKeyDown={onPanelKey}>
        {children({ menuId, close })}
      </div>
    </div>
  );
}
