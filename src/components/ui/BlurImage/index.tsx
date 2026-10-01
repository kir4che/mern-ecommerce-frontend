import { useState } from "react";

import { cn } from "@/utils/cn";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const BlurImage = ({
  src,
  alt,
  className,
  onLoad,
  onError,
  ...props
}: BlurImageProps) => {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoading(false);
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <>
      {isLoading && !hasError && (
        <div
          role="status"
          aria-label="圖片載入中"
          className="rounded-inherit absolute inset-0 z-0 size-full skeleton"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "relative z-10 size-full object-cover object-center transition-opacity duration-700 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </>
  );
};

export default BlurImage;
