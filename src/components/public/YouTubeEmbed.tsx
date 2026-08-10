'use client';

import { useState } from 'react';
import Image from 'next/image';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`youtube-embed ${className}`} onClick={() => setIsLoaded(true)}>
      {!isLoaded ? (
        <>
          <div className="youtube-embed__thumbnail-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
            <Image 
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="youtube-embed__thumbnail"
              loading="lazy"
            />
            <button 
              className="youtube-embed__play-btn"
              aria-label={`Play video: ${title}`}
            >
              ▶
            </button>
          </div>
        </>
      ) : (
        <iframe
          className="youtube-embed__iframe"
          style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
