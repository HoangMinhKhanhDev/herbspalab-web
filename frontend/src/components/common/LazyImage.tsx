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

  return (
    <div 
      className={`lazy-image-container ${className}`} 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Placeholder color
        width: width || '100%',
        height: height || '100%'
      }}
    >
      {/* Loading Overlay/Skeleton */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(110deg, #f0f0f0 8%, #f7f7f7 18%, #f0f0f0 33%)',
              backgroundSize: '200% 100%',
              zIndex: 1
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        width={width}
        height={height}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
};

export default LazyImage;
