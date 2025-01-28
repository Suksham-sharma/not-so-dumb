import { Innertube } from "youtubei.js/web";

const youtube = await Innertube.create({
  lang: "en",
  location: "US",
  retrieve_player: false,
});

export const extractYoutubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchTranscript = async (
  url: string
): Promise<(string | undefined)[]> => {
  try {
    const videoId = extractYoutubeId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      throw new Error("Failed to fetch transcript data");
    }

    return transcriptData.transcript.content.body.initial_segments.map(
      (segment) => segment.snippet.text
    );
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};
