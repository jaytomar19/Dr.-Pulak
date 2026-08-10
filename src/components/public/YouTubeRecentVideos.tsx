'use client';

// TODO: Replace with YouTube Data API v3 channel pull

interface YouTubeRecentVideosProps {
  channelName?: string;
  maxVideos?: number;
}

export default function YouTubeRecentVideos({ 
  channelName = 'Dr. Pulak Vatsya',
  maxVideos = 4 
}: YouTubeRecentVideosProps) {
  
  const videos = [
    { id: 'dQw4w9WgXcQ', title: 'What to expect after Knee Replacement', date: '1 week ago' },
    { id: 'dQw4w9WgXcQ', title: 'ACL Tear Recovery Timeline', date: '2 weeks ago' },
    { id: 'dQw4w9WgXcQ', title: 'Exercises for Knee Pain', date: '1 month ago' },
    { id: 'dQw4w9WgXcQ', title: 'When do you need surgery?', date: '2 months ago' },
  ].slice(0, maxVideos);

  return (
    <div className="youtube-recent">
      <h2 className="youtube-recent__heading">Latest Videos from {channelName}</h2>
      
      <div className="youtube-recent__grid">
        {videos.map((video, idx) => (
          <div key={idx} className="youtube-recent__card">
            <img 
              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
              alt={video.title}
              className="youtube-recent__card-thumbnail" 
              loading="lazy"
            />
            <h3 className="youtube-recent__card-title">{video.title}</h3>
            <p className="youtube-recent__card-date">{video.date}</p>
          </div>
        ))}
      </div>
      
      <a href="#" className="youtube-recent__link" target="_blank" rel="noopener noreferrer">
        Visit YouTube Channel
      </a>
    </div>
  );
}
