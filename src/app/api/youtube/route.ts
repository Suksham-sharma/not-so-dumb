import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    const video = await youtube.getInfo(videoId);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Get transcript if available
    let transcript = "";
    try {
      const transcriptData = await video.getTranscript();
      if (transcriptData?.transcript?.content?.body?.initial_segments) {
        transcript = transcriptData.transcript.content.body.initial_segments
          .map((segment: any) => segment.snippet.text)
          .join(" ")
          .replace(/\n+/g, " ")
          .trim();
      }
    } catch (error) {
      console.warn("Transcript not available:", error);
    }

    const videoData = {
      id: videoId,
      title: video.basic_info.title || "Unknown Title",
      description: video.basic_info.short_description || "",
      thumbnail: video.basic_info.thumbnail?.[0]?.url || "",
      duration: formatDuration(video.basic_info.duration || 0),
      transcript,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };

    return NextResponse.json(videoData);
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    );
  }
}

function formatDuration(seconds: number): string {
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
