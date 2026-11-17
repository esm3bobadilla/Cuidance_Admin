'use client';

import { useEffect, useRef } from 'react';

/*
 * Opens and closes a native <dialog> as a modal. The browser keeps keyboard focus
 * inside it, makes the rest of the page inert and closes it on Escape. This hook
 * adds the rest of the approved behavior: focus returns to the control that opened
 * it, and a click on the backdrop closes it.
 */
export function useNativeDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      onCloseRef.current();
      opener.current?.focus();
      opener.current = null;
    };
    // A click whose target is the <dialog> itself landed on the backdrop
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
}
