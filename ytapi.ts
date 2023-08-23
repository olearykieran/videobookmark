import axios from 'axios';
import { YOUTUBE_API_KEY } from '@env';

type Bookmark = {
  __typename?: "Bookmark",
  id?: string,
  url: string,
  timestamp: number,
  title?: string | null,
  thumbnail?: string | null,
  note?: string | null,
  userID?: string,
  createdAt?: string,
  updatedAt?: string,
  _version?: number,
  _deleted?: boolean | null,
  _lastChangedAt?: number,
};

export const parseYoutubeURL = async (url: string): Promise<Bookmark> => {
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  const timestampMatch = url.match(/t=(\d+)/);
  const timestamp = timestampMatch ? Number(timestampMatch[1]) : 0;

  const apiKey = YOUTUBE_API_KEY
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

