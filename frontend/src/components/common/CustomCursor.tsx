import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useSpring(0, { stiffness: 400, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('interactive') ||
        target.classList.contains('product-card-premium') ||
        target.classList.contains('util-icon');
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(188, 163, 127, 0.1)' : 'transparent',
          borderColor: isHovered ? 'transparent' : 'var(--secondary)',
        }}
      />
      <motion.div 
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--secondary)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10001,
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          opacity: isHovered ? 0 : 1
        }}
      />
    </>
  );
};

export default CustomCursor;
