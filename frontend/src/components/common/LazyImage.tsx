import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const LazyImage = ({ src, alt, className, width, height }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for true lazy loading
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: width || '100%',
          height: height || '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--clr-cream)',
          color: '#bbb',
          fontSize: '0.8rem'
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--clr-cream)',
        width: width || '100%',
        height: height || '100%'
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--clr-cream)',
            zIndex: 1
          }}
        />
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in'
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
