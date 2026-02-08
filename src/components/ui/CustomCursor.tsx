import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const move = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest('[data-cursor]');
      if (cursorEl) {
        setCursorLabel((cursorEl as HTMLElement).dataset.cursor || null);
        setIsHovering(true);
        return;
      }
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      }
    };

    const out = () => {
      setIsHovering(false);
      setCursorLabel(null);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);

    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = 'a, button, [role="button"], input, textarea, select, [data-cursor] { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      document.body.style.cursor = '';
      document.getElementById('custom-cursor-style')?.remove();
    };
  }, []);

  if (isTouch) return null;

  const isLabel = !!cursorLabel;
  const size = isLabel ? 48 : isHovering ? 24 : 8;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center"
      animate={{
        x: position.x - size / 2,
        y: position.y - size / 2,
        width: size,
        height: size,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
      style={{
        borderRadius: '50%',
        backgroundColor: 'white',
      }}
    >
      {isLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[8px] font-medium text-black uppercase tracking-wider"
        >
          {cursorLabel}
        </motion.span>
      )}
    </motion.div>
  );
}
