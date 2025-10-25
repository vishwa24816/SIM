
'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  text?: string;
  confirmedText?: string;
}

export function SwipeToConfirm({
  onConfirm,
  text = 'Swipe to Invest',
  confirmedText = 'Confirmed',
}: SwipeToConfirmProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const x = useMotionValue(0);
  const swipeButtonRef = React.useRef<HTMLDivElement>(null);

  const onDragEnd = () => {
    if (swipeButtonRef.current) {
      const parentWidth = swipeButtonRef.current.parentElement?.offsetWidth || 0;
      const buttonWidth = swipeButtonRef.current.offsetWidth;
      const threshold = parentWidth - buttonWidth - 10; // 10px buffer

      if (x.get() > threshold) {
        setIsConfirmed(true);
        onConfirm();
      }
    }
  };
  
  const backgroundOpacity = useTransform(x, [0, 100], [0, 1]);
  const color = useTransform(x, [0, 150], ["#9ca3af", "#ffffff"]);

  return (
    <div className="relative w-full h-14 bg-muted rounded-full p-2 flex items-center overflow-hidden">
      <AnimatePresence>
        {!isConfirmed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium z-0"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        ref={swipeButtonRef}
        drag="x"
        dragConstraints={{ left: 0, right: 280 }} // Approximate right constraint
        dragElastic={{ right: 0, left: 0.05 }}
        onDragEnd={onDragEnd}
        style={{ x }}
        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        whileTap={{ scale: 1.1 }}
      >
        <motion.div style={{ color }}>
          <ChevronRight className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-green-600 rounded-full"
          >
            <Check className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-semibold">{confirmedText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
