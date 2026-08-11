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

export const YOUTUBE_VIDEOS_CONFIG: { videos: YouTubeVideo[]; isPlaceholder: boolean } = {
  isPlaceholder: true,
  videos: [
    {
      id: 'yt-placeholder-1',
      title: 'Understanding Modern Knee Replacement Surgery',
      youtubeUrl: '#',
      category: 'Patient Guide',
      duration: '5:30',
      isFeatured: true,
      isPlaceholder: true,
    },
    {
      id: 'yt-placeholder-2',
      title: 'ACL Reconstruction: Step-by-Step Rehabilitation Path',
      youtubeUrl: '#',
      category: 'Rehabilitation',
      duration: '7:15',
      isFeatured: true,
      isPlaceholder: true,
    },
    {
      id: 'yt-placeholder-3',
      title: 'Non-Surgical Treatments for Early Knee Osteoarthritis',
      youtubeUrl: '#',
      category: 'Conservative Care',
      duration: '4:45',
      isFeatured: true,
      isPlaceholder: true,
    },
  ],
};
