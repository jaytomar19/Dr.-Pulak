export interface InstagramReel {
  id: string;
  title: string;
  shortDescription: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt?: string;
  isFeatured?: boolean;
  isPlaceholder: boolean;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
  category: string;
  duration?: string;
  isFeatured?: boolean;
  isPlaceholder: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: string;
  coverImage?: string;
}

export const INSTAGRAM_REELS_CONFIG: { reels: InstagramReel[]; isPlaceholder: boolean } = {
  isPlaceholder: true,
  reels: [
    {
      id: 'reel-placeholder-1',
      title: 'Knee Health & Joint Mobility Tips',
      shortDescription: 'Practical advice on preserving joint health and preventing ligament strain.',
      instagramUrl: '#',
      category: 'Joint Health',
      isFeatured: true,
      isPlaceholder: true,
    },
    {
      id: 'reel-placeholder-2',
      title: 'ACL Injury Prevention & Rehabilitation',
      shortDescription: 'Key exercises for sports injury prevention and post-surgical recovery.',
      instagramUrl: '#',
      category: 'Sports Medicine',
      isFeatured: true,
      isPlaceholder: true,
    },
    {
      id: 'reel-placeholder-3',
      title: 'When to Consider Robotic Knee Replacement',
      shortDescription: 'Understanding precision alignment and recovery timelines.',
      instagramUrl: '#',
      category: 'Robotic Surgery',
      isFeatured: true,
      isPlaceholder: true,
    },
  ],
};

export const YOUTUBE_VIDEOS_CONFIG: { videos: YouTubeVideo[]; isPlaceholder: boolean; channelUrl: string } = {
  isPlaceholder: false,
  channelUrl: 'https://www.youtube.com/@drpulakvatsya',
  videos: [
    {
      id: 'yt-1',
      videoId: 'Gy5ywiHvJ6k',
      title: 'Fix Meniscus Tear without Surgery (100% Effective) | AIIMS Doctor Explains!',
      youtubeUrl: 'https://youtu.be/Gy5ywiHvJ6k',
      category: 'Non-Surgical Care',
      isFeatured: true,
      isPlaceholder: false,
    },
    {
      id: 'yt-2',
      videoId: 'TnGw5twNLwY',
      title: 'Knee Replacement Surgery',
      youtubeUrl: 'https://youtu.be/TnGw5twNLwY',
      category: 'Knee Surgery',
      isFeatured: true,
      isPlaceholder: false,
    },
    {
      id: 'yt-3',
      videoId: '40SASS3OaY8',
      title: 'Knee Replacement',
      youtubeUrl: 'https://youtu.be/40SASS3OaY8',
      category: 'Robotic Surgery',
      isFeatured: true,
      isPlaceholder: false,
    },
  ],
};
