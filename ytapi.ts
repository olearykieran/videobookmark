import axios from 'axios';

interface Bookmark {
  id: string;
  url: string;
  timestamp: number;
  title?: string;
  thumbnail?: string;
  note?: string;
}

export const parseYoutubeURL = async (url: string): Promise<Bookmark> => {
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  const timestampMatch = url.match(/t=(\d+)/);
  const timestamp = timestampMatch ? Number(timestampMatch[1]) : 0;

  const apiKey = 'AIzaSyDHZhJzI5REakPToKO-QXqxuKxzotrLDc4'; // Replace with your YouTube API key
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  try {
    const response = await axios.get(apiUrl);
    const { title, thumbnails, description } = response.data.items[0].snippet;

    return {
      id: videoId,
      url,
      timestamp,
      title,
      thumbnail: thumbnails.default.url,
      note: description,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return { id: videoId, url, timestamp }; // Return basic information if fetching additional details fails
  }
};

