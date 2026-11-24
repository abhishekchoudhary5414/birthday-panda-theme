import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tagQuery = searchParams.get('tag')?.trim().replace(/^#/, '') || '';
  const mediaType = searchParams.get('type') || 'top_media'; // 'top_media' or 'recent_media'
  const afterCursor = searchParams.get('after') || '';

  if (!tagQuery) {
    return NextResponse.json({ error: 'Hashtag query "tag" is required' }, { status: 400 });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
  const userId = process.env.INSTAGRAM_USER_ID || '';
  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v27.0';

  if (!accessToken || !userId) {
    return NextResponse.json(
      { error: 'Instagram credentials (INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID) are missing from configuration.' },
      { status: 500 }
    );
  }

  try {
    // 1. Search for Hashtag ID
    const searchUrl = `https://graph.facebook.com/${apiVersion}/ig_hashtag_search?user_id=${userId}&q=${encodeURIComponent(tagQuery)}&access_token=${accessToken}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.error) {
      return NextResponse.json(
        { error: searchData.error.message || 'Failed to search hashtag on Instagram' },
        { status: 400 }
      );
    }

    if (!searchData.data || searchData.data.length === 0) {
      return NextResponse.json({
        success: true,
        tag: tagQuery,
        hashtagId: null,
        posts: [],
        paging: null,
        message: `No hashtag found for #${tagQuery}`,
      });
    }

    const hashtagId = searchData.data[0].id;

    // 2. Fetch media posts (top_media or recent_media)
    // We request 8 posts per page as requested by user
    const endpoint = mediaType === 'recent_media' ? 'recent_media' : 'top_media';
    const fields = 'id,caption,media_type,media_url,permalink,like_count,comments_count,timestamp,children{media_url,media_type}';
    
    let mediaUrl = `https://graph.facebook.com/${apiVersion}/${hashtagId}/${endpoint}?user_id=${userId}&fields=${fields}&limit=8&access_token=${accessToken}`;
    if (afterCursor) {
      mediaUrl += `&after=${encodeURIComponent(afterCursor)}`;
    }

    const mediaRes = await fetch(mediaUrl);
    const mediaData = await mediaRes.json();

    if (mediaData.error) {
      return NextResponse.json(
        { error: mediaData.error.message || 'Failed to retrieve media for hashtag' },
        { status: 400 }
      );
    }

    const posts = (mediaData.data || []).map((post: any) => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type,
      mediaUrl: post.media_url || (post.children?.data?.[0]?.media_url ?? null),
      permalink: post.permalink || `https://www.instagram.com/p/${post.id}/`,
      likeCount: post.like_count ?? 0,
      commentsCount: post.comments_count ?? 0,
      timestamp: post.timestamp,
    }));

    return NextResponse.json({
      success: true,
      tag: tagQuery,
      hashtagId,
      mediaType: endpoint,
      posts,
      paging: mediaData.paging || null,
      nextCursor: mediaData.paging?.cursors?.after || null,
      hasNext: Boolean(mediaData.paging?.cursors?.after),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error fetching Instagram hashtag posts';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
