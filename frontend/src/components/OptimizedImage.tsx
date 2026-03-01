import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallback?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  fallback = "/placeholder.svg",
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  const imgSrc = error ? fallback : src;

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchpriority: "high" } : {})}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (!error) setError(true);
      }}
    />
  );
};

export default OptimizedImage;
