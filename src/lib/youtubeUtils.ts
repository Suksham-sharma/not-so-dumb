import { YouTubeVideo } from "@/types";

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
    /youtube\.com\/live\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Checks if a string contains a YouTube URL
 */
export function containsYouTubeUrl(text: string): boolean {
  const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/;
  return youtubePattern.test(text);
}

/**
 * Extracts YouTube URL from text
 */
export function extractYouTubeUrl(text: string): string | null {
  const urlPattern =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+(?:\S+)?/g;
  const match = text.match(urlPattern);
  return match ? match[0] : null;
}

/**
 * Fetches YouTube video information and transcript
 */
export async function fetchYouTubeVideoData(
  videoId: string
): Promise<YouTubeVideo | undefined> {
  try {
    const response = await fetch(`/api/youtube?videoId=${videoId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching YouTube video data:", error);
    return undefined;
  }
}

/**
 * Formats duration from seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
