// Vercel Serverless Function — YouTube Stats Fetch
// POST /api/fetch-youtube-stats
// Body: { channel_url }
// Returns: { subscribers, total_views, video_count, channel_title, thumbnail }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexmusiclatino.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY not configured. Get one free at console.cloud.google.com' });
  }

  const { channel_url } = req.body;
  if (!channel_url) {
    return res.status(400).json({ error: 'Missing channel_url' });
  }

  try {
    // Extract channel identifier from various YouTube URL formats
    const channelId = await resolveChannelId(channel_url, YOUTUBE_API_KEY);
    if (!channelId) {
      return res.status(400).json({ error: 'Could not resolve YouTube channel from URL. Try a youtube.com/channel/UC... URL.' });
    }

    // Fetch channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    if (!statsData.items || !statsData.items.length) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channel = statsData.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;

    return res.status(200).json({
      channel_id: channelId,
      channel_title: snippet.title,
      thumbnail: snippet.thumbnails?.default?.url || '',
      subscribers: parseInt(stats.subscriberCount) || 0,
      total_views: parseInt(stats.viewCount) || 0,
      video_count: parseInt(stats.videoCount) || 0,
      hidden_subscribers: stats.hiddenSubscriberCount || false,
      synced_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('YouTube fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch YouTube data: ' + err.message });
  }
}

async function resolveChannelId(url, apiKey) {
  // Direct channel ID: youtube.com/channel/UCxxxxxx
  const channelMatch = url.match(/youtube\.com\/channel\/(UC[\w-]+)/);
  if (channelMatch) return channelMatch[1];

  // Handle @username format: youtube.com/@username
  const handleMatch = url.match(/youtube\.com\/@([\w.-]+)/);
  if (handleMatch) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handleMatch[1]}&key=${apiKey}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data.items && data.items.length) return data.items[0].id;
  }

  // Handle /c/customname or /user/username
  const customMatch = url.match(/youtube\.com\/(?:c|user)\/([\w.-]+)/);
  if (customMatch) {
    // Search for channel by custom URL name
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&type=channel&q=${encodeURIComponent(customMatch[1])}&maxResults=1&key=${apiKey}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data.items && data.items.length) return data.items[0].id.channelId;
  }

  // If just a channel ID was passed directly
  if (/^UC[\w-]+$/.test(url.trim())) return url.trim();

  return null;
}
