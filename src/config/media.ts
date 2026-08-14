export interface InstagramReel {
  id: string;
  reelId?: string;
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

export const INSTAGRAM_REELS_CONFIG: { reels: InstagramReel[]; isPlaceholder: boolean; instagramPageUrl: string } = {
  isPlaceholder: false,
  instagramPageUrl: 'https://www.instagram.com/dr.pulakvatsya/',
  reels: [
    {
      id: 'reel-1',
      reelId: 'DVrEsMJk9t3',
      title: 'Knee Health & Joint Mobility Tips',
      shortDescription: 'Practical advice from Dr. Pulak Vatsya on preserving joint health and preventing ligament strain.',
      instagramUrl: 'https://www.instagram.com/reel/DVrEsMJk9t3/',
      category: 'Joint Health',
      isFeatured: true,
      isPlaceholder: false,
    },
    {
      id: 'reel-2',
      reelId: 'DbVw_vST6y2',
      title: 'ACL Injury Prevention & Rehabilitation',
      shortDescription: 'Key exercises for sports injury prevention and post-surgical recovery.',
      instagramUrl: 'https://www.instagram.com/reel/DbVw_vST6y2/',
      category: 'Sports Medicine',
      isFeatured: true,
      isPlaceholder: false,
    },
    {
      id: 'reel-3',
      reelId: 'DbI27ZKTIWH',
      title: 'When to Consider Robotic Knee Replacement',
      shortDescription: 'Understanding sub-millimeter precision alignment and recovery timelines.',
      instagramUrl: 'https://www.instagram.com/reel/DbI27ZKTIWH/',
      category: 'Robotic Surgery',
      isFeatured: true,
      isPlaceholder: false,
    },
  ],
};

export const YOUTUBE_VIDEOS_CONFIG: { videos: YouTubeVideo[]; isPlaceholder: boolean; channelUrl: string } = {
  isPlaceholder: false,
  channelUrl: 'https://www.youtube.com/@drpulakvatsyaortho',
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
      videoId: 'ir7-cu3g3FY',
      title: '5 Warning Signs of ACL Injury You Should Never Ignore | AIIMS Doctor Explains',
      youtubeUrl: 'https://youtu.be/ir7-cu3g3FY',
      category: 'ACL & Ligament',
      isFeatured: true,
      isPlaceholder: false,
    },
  ],
};
