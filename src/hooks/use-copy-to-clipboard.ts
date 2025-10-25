
"use client";

import { useState } from 'react';
import { useToast } from './use-toast';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      toast({
        variant: 'destructive',
        title: 'Clipboard not available',
        description: 'Clipboard API is not available in your browser.',
      });
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy text to clipboard.',
      });
      return false;
    }
  };

  return { copiedText, copy };
}
