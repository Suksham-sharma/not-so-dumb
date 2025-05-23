import axios from "axios";

export const fetchTranscript = async (url: string): Promise<string[]> => {
  const response = await axios.post("/api/youtube", { url });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to fetch transcript");
  }

  return response.data.transcript;
};
