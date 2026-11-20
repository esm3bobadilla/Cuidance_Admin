'use client';

import { useEffect, useState } from 'react';

// A temporary browser address for a chosen image, so it can be shown without uploading it.
// The address is released when the image changes or the component goes away.
export function useObjectUrl(file: File | null | undefined) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!file) {
      setUrl('');
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url;
}
