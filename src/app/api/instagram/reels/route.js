import { NextResponse } from 'next/server';

// Default fallback reels to display if API token is not yet connected
const defaultReels = [
  {
    id: 'reel_1',
    caption: '✨ Making our bestselling Galaxy Resin Keychain! The purple swirls and holographic glitters are unreal 😍 #resinart #keychain',
    media_type: 'VIDEO',
    media_url: '/images/placeholder.svg',
    thumbnail_url: '/images/placeholder.svg',
    permalink: 'https://www.instagram.com/newkhushiresincreations/',
    timestamp: new Date().toISOString(),
    views: '14.2k',
    likes: '1.2k',
    title: 'Galaxy Keychain Making'
  },
  {
    id: 'reel_2',
    caption: '🌸 Preserving real dried roses in custom photo frames. Watch the crystal clear pour! Perfect anniversary gift ❤️ #resinframe',
    media_type: 'VIDEO',
    media_url: '/images/placeholder.svg',
    thumbnail_url: '/images/placeholder.svg',
    permalink: 'https://www.instagram.com/newkhushiresincreations/',
    timestamp: new Date().toISOString(),
    views: '28.5k',
    likes: '2.4k',
    title: 'Floral Frame Pouring'
  },
  {
    id: 'reel_3',
    caption: '🏠 Custom Golden Nameplate for a new home! Complete resin unmolding ASMR. DM to order yours ✨ #nameplate #homedecor',
    media_type: 'VIDEO',
    media_url: '/images/placeholder.svg',
    thumbnail_url: '/images/placeholder.svg',
    permalink: 'https://www.instagram.com/newkhushiresincreations/',
    timestamp: new Date().toISOString(),
    views: '9.8k',
    likes: '890',
    title: 'Unmolding Custom Nameplate'
  },
  {
    id: 'reel_4',
    caption: '💎 Rose gold flakes + dried baby breath flowers in resin earrings. Lightweight & hypoallergenic! #resinjewelry #earrings',
    media_type: 'VIDEO',
    media_url: '/images/placeholder.svg',
    thumbnail_url: '/images/placeholder.svg',
    permalink: 'https://www.instagram.com/newkhushiresincreations/',
    timestamp: new Date().toISOString(),
    views: '18.1k',
    likes: '1.7k',
    title: 'Rose Gold Earrings Process'
  }
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  // If user has added their Instagram Graph API access token, fetch real live posts/reels
  if (token) {
    try {
      const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=12`;
      
      const res = await fetch(apiUrl, {
        next: { revalidate: 600 } // Auto-refresh cache every 10 minutes!
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          // Format media, prioritize videos/reels
          const reels = data.data.map(item => ({
            id: item.id,
            caption: item.caption || 'New Khushi Resin Creations',
            media_type: item.media_type,
            media_url: item.media_url,
            thumbnail_url: item.thumbnail_url || item.media_url,
            permalink: item.permalink,
            timestamp: item.timestamp,
            isLive: true
          }));

          return NextResponse.json({
            success: true,
            isLive: true,
            reels: reels.slice(0, 8)
          });
        }
      } else {
        console.warn('Instagram API returned error status:', res.status);
      }
    } catch (apiErr) {
      console.error('Error fetching live Instagram reels:', apiErr.message);
    }
  }

  // Fallback to default reels
  return NextResponse.json({
    success: true,
    isLive: false,
    reels: defaultReels
  });
}

