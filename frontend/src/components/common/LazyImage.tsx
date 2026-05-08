import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const LazyImage = ({ src, alt, className, width, height }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const blurSrc = `${src}&blur=50&w=20`;

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
            width={width}
            height={height}
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
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default LazyImage;
