import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage = ({ src, alt, className }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurSrc, setBlurSrc] = useState('');

  useEffect(() => {
    // Simulate a tiny placeholder or use a colored box
    setBlurSrc(`${src}&blur=50&w=20`);
  }, [src]);

  return (
    <div className={`lazy-image-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.img
            src={blurSrc}
            alt={alt}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="blur-placeholder"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'blur(20px)',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        )}
      </AnimatePresence>
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default LazyImage;
