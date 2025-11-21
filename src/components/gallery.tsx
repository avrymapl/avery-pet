'use client';
import { useState } from 'react';
import Image from 'next/image';
import NextIcon from '@/app/icons/NextIcon';
import BackIcon from '@/app/icons/BackIcon';

interface GalleryProps {
  images: Array<{ src: string; alt: string }>;
}

const TWO_COLUMN_THRESHOLD = 2;

export default function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isSingleImage = images.length === 1;

  const gridClass = isSingleImage
    ? 'lightbox-preview'
    : images.length === TWO_COLUMN_THRESHOLD
    ? 'gallery-grid gallery-grid-two-col'
    : 'gallery-grid gallery-grid-auto';

  const PreviewWrapper = isSingleImage ? 'span' : 'div';

  return (
    <>
      {/* preview image(s) - single image or grid */}
      <PreviewWrapper className={gridClass}>
        {images.map((image, index) => (
          <div
            key={image.src}
            onClick={() => setLightboxIndex(index)}
            className={isSingleImage ? undefined : 'gallery-item'}
            style={
              isSingleImage ? { position: 'relative', width: '100%', height: '100%' } : undefined
            }
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        ))}
      </PreviewWrapper>

      {/* lightbox modal with navigation (only show nav buttons if multiple images) */}
      {lightboxIndex !== null && (
        <div onClick={() => setLightboxIndex(null)} className="lightbox-overlay">
          <div className="lightbox-image-container">
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
            />

            {/* previous button - only for multiple images */}
            {!isSingleImage && lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                className="icon-box nav-icon lightbox-nav-button prev"
              >
                <BackIcon className="icon" />
              </button>
            )}

            {/* next button - only for multiple images */}
            {!isSingleImage && lightboxIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                className="icon-box nav-icon lightbox-nav-button next"
              >
                <NextIcon className="icon" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
