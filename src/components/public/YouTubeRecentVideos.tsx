'use client';

import React from 'react';
import Image from 'next/image';
import { YOUTUBE_VIDEOS_CONFIG } from '@/config/media';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import TiltCard from '@/components/shared/TiltCard';

interface YouTubeRecentVideosProps {
  channelName?: string;
  maxVideos?: number;
}

export default function YouTubeRecentVideos({ 
  channelName = 'Dr. Pulak Vatsya',
  maxVideos = 3 
}: YouTubeRecentVideosProps) {
  const { videos, isPlaceholder, channelUrl } = YOUTUBE_VIDEOS_CONFIG;
  const displayVideos = videos.slice(0, maxVideos);

  return (
    <section className="insights-section">
      <div className="container">
        <Reveal variant="fade-up" className="insights-header">
          <div>
            <span className="eyebrow">CLINICAL INSIGHTS</span>
            <h2 className="insights-title">Educational Resources & Patient Guidance from {channelName}</h2>
          </div>
          <a
            href={channelUrl}
            className="btn btn--ghost btn--sm insights-link"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="button"
          >
            Visit Video Library →
          </a>
        </Reveal>

        {isPlaceholder && (
          <div className="placeholder-content-banner" style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge--neutral">
              DEVELOPMENT PLACEHOLDER — Real YouTube Video IDs to be provided by client
            </span>
          </div>
        )}
        
        <Stagger className="insights-grid" staggerInterval={110}>
          {displayVideos.map((video) => (
            <TiltCard key={video.id} maxTilt={3} scale={1.02}>
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="insights-card-link"
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}
              >

                <article className="insights-card" data-cursor="card">
                  <div className="insights-card__media">
                    {video.videoId ? (
                      <Image 
                        src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} 
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="insights-card__thumb"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="insights-card__placeholder-thumb">
                        <span>🎬 Video Coming Soon</span>
                      </div>
                    )}
                    <div className="insights-card__play" data-cursor="button">
                      <span>▶</span>
                    </div>
                    {video.duration && <span className="insights-card__duration">{video.duration}</span>}
                  </div>
                  <div className="insights-card__body">
                    <span className="insights-card__category">{video.category}</span>
                    <h3 className="insights-card__title">{video.title}</h3>
                  </div>
                </article>
              </a>
            </TiltCard>
          ))}
        </Stagger>

        <Reveal variant="fade-up" delay={150}>
          <div className="insights-bottom-action text-center" style={{ marginTop: '2.5rem' }}>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost btn--md"
              data-cursor="button"
            >
              Browse Full Educational Video Library →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
