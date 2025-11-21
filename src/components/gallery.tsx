'use client';
import { useState } from 'react';
import Image from 'next/image';
import NextIcon from '@/app/icons/NextIcon';
import BackIcon from '@/app/icons/BackIcon';

interface GalleryProps {
  images: Array<{ src: string; alt: string }>;
}

const MAX_PREVIEW_IMAGES = 4;

export default function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isSingleImage = images.length === 1;
  const previewImages = images.slice(0, MAX_PREVIEW_IMAGES);
  const remainingCount = images.length - MAX_PREVIEW_IMAGES;

  const getGridClass = () => {
    if (isSingleImage) return 'lightbox-preview';
    if (images.length === 2) return 'gallery-grid gallery-grid-two-col';
    if (images.length === 3) return 'gallery-grid gallery-grid-three-col';
    return 'gallery-grid gallery-grid-four-col';
  };

  const gridClass = getGridClass();
  const PreviewWrapper = isSingleImage ? 'span' : 'div';

  return (
    <>
      {/* preview image(s) - single image or grid */}
      <PreviewWrapper className={gridClass}>
        {previewImages.map((image, index) => {
          const isLastPreview = index === MAX_PREVIEW_IMAGES - 1;
          const showMoreOverlay = isLastPreview && remainingCount > 0;

          return (
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
              {showMoreOverlay && (
                <div className="gallery-more-overlay">
                  <span className="gallery-more-text">+{remainingCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </PreviewWrapper>

      {/* lightbox modal with navigation (only show nav buttons if multiple images) */}
      {lightboxIndex !== null && (
        <div onClick={() => setLightboxIndex(null)} className="lightbox-overlay">
          {/* previous button - only for multiple images */}
          {!isSingleImage && lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="icon-box nav-icon lightbox-nav-button"
            >
              <BackIcon className="icon" />
            </button>
          )}

          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
            />
          </div>

          {/* next button - only for multiple images */}
          {!isSingleImage && lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="icon-box nav-icon lightbox-nav-button"
            >
              <NextIcon className="icon" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
