// netlify/functions/youtube-api.js
const https = require('https');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ ok: res.statusCode === 200, json: () => Promise.resolve(parsed), status: res.statusCode });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

exports.handler = async (event, context) => {
  const YOUTUBE_API_KEY = process.env.HUGO_YOUTUBE_API_KEY;
  const CHANNEL_ID = 'UCjB24gwQdmWQ7j4gQkZipHw';
  
  console.log('Environment check:', {
    hasApiKey: !!YOUTUBE_API_KEY,
    apiKeyLength: YOUTUBE_API_KEY ? YOUTUBE_API_KEY.length : 0
  });
  
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  if (!YOUTUBE_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' })
    };
  }
  
  try {
    // 1단계: 채널 정보 가져오기 (brandingSettings 추가)
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,brandingSettings&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await makeRequest(channelUrl);
    
    if (!channelResponse.ok) {
      throw new Error(`채널 정보 오류: ${channelResponse.status}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('채널을 찾을 수 없습니다.');
    }
    
    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    
    // 채널아트 URL 추출
    let bannerUrl = '';
    if (channel.brandingSettings && channel.brandingSettings.image) {
      bannerUrl = channel.brandingSettings.image.bannerExternalUrl || 
                 channel.brandingSettings.image.bannerImageUrl || '';
    }
    
    // 2단계: 비디오 목록 가져오기
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=20&key=${YOUTUBE_API_KEY}`;
    const videosResponse = await makeRequest(videosUrl);
    
    if (!videosResponse.ok) {
      throw new Error(`비디오 목록 오류: ${videosResponse.status}`);
    }
    
    const videosData = await videosResponse.json();
    
    // 필요한 데이터만 정리해서 반환
    const result = {
      channelInfo: {
        title: channel.snippet.title,
        thumbnailUrl: channel.snippet.thumbnails.default.url,
        bannerUrl: bannerUrl
      },
      videos: videosData.items.map(item => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt
      }))
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    console.error('YouTube API 오류:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'YouTube 데이터를 가져오는데 실패했습니다.',
        message: error.message 
      })
    };
  }
};