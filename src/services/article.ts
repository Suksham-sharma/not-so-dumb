import axios from "axios";

export const extractArticleContent = async (url: string): Promise<string> => {
  const response = await axios.post("/api/extract", { url });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to fetch article content");
  }
  const responseContent = response.data.results[0].raw_content;
  console.log(responseContent);

  if (!responseContent) {
    throw new Error("Failed to fetch article content");
  }

  return responseContent;
};
