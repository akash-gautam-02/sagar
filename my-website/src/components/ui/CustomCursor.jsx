import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleHover = (e) => {
      if (e.target.closest('a, button, [role="button"], .hover-cursor')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleHover);
    };
  }, [isVisible]);

  // Hide on touch devices or small screens where custom cursor is buggy
  if (!isVisible || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.5)' : '#fff',
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5, bounce: 0.2 }}
    >
      {isHovering && <div className="w-1 h-1 bg-white rounded-full"></div>}
    </motion.div>
  );
};

export default CustomCursor;
