'use client';

interface YouTubeRecentVideosProps {
  channelName?: string;
  maxVideos?: number;
}

export default function YouTubeRecentVideos({ 
  channelName = 'Dr. Pulak Vatsya',
  maxVideos = 3 
}: YouTubeRecentVideosProps) {
  
  const videos = [
    { 
      id: 'dQw4w9WgXcQ', 
      category: 'PATIENT EDUCATION',
      title: 'What to Expect Before & After Knee Replacement Surgery', 
      date: 'Recent Insight',
      duration: '5:20'
    },
    { 
      id: 'dQw4w9WgXcQ', 
      category: 'SPORTS INJURY',
      title: 'ACL Tear Recovery Timeline & Rehabilitation Phases', 
      date: 'Recent Insight',
      duration: '6:45'
    },
    { 
      id: 'dQw4w9WgXcQ', 
      category: 'JOINT PRESERVATION',
      title: 'Non-Surgical Treatments & Exercises for Chronic Knee Pain', 
      date: 'Recent Insight',
      duration: '4:15'
    },
  ].slice(0, maxVideos);

  return (
    <section className="insights-section">
      <div className="container">
        <div className="insights-header">
          <div>
            <span className="eyebrow">CLINICAL INSIGHTS</span>
            <h2 className="insights-title">Educational Resources & Patient Guidance from {channelName}</h2>
          </div>
          <a href="#" className="btn btn--ghost btn--sm insights-link" target="_blank" rel="noopener noreferrer">
            Visit Video Library →
          </a>
        </div>
        
        <div className="insights-grid">
          {videos.map((video, idx) => (
            <article key={idx} className="insights-card">
              <div className="insights-card__media">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                  alt={video.title}
                  className="insights-card__thumb" 
                  loading="lazy"
                />
                <div className="insights-card__play">
                  <span>▶</span>
                </div>
                <span className="insights-card__duration">{video.duration}</span>
              </div>
              <div className="insights-card__body">
                <span className="insights-card__category">{video.category}</span>
                <h3 className="insights-card__title">{video.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
