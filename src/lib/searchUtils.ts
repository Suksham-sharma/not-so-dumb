import axios from "axios";
import { SearchResult, ChatSection } from "../types";

export const fetchTavilyResults = async (
  query: string,
  abortController: AbortController
) => {
  return axios.post(
    "/api/tavily",
    {
      query,
      includeImages: true,
      includeImageDescriptions: true,
    },
    {
      signal: abortController?.signal,
    }
  );
};

export const processSearchResults = (searchData: any) => {
  return searchData.results.map((result: SearchResult, index: number) => ({
    ...result,
    image: searchData.images?.[index],
  }));
};

export const updateSectionWithSearchResults = (
  sectionIndex: number,
  results: any[],
  setChatSections: React.Dispatch<React.SetStateAction<ChatSection[]>>
) => {
  setChatSections((prev) => {
    const updated = [...prev];
    if (updated[sectionIndex]) {
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        searchResults: results,
        isLoadingSources: false,
        isLoadingThinking: true,
      };
    }
    return updated;
  });
};

export const updateSectionWithResponse = (
  sectionIndex: number,
  response: string,
  setChatSections: React.Dispatch<React.SetStateAction<ChatSection[]>>
) => {
  setChatSections((prev) => {
    const updated = [...prev];
    if (updated[sectionIndex]) {
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        response,
      };
    }
    return updated;
  });
};

export const prepareReasoningInput = (
  query: string,
  results: any[],
  searchData: any
) => {
  const searchContext = results
    .map(
      (result: SearchResult, index: number) =>
        `[Source ${index + 1}]: ${result.title}\n${result.content}\nURL: ${
          result.url
        }\n`
    )
    .join("\n\n");

  const tavilyAnswer = searchData.answer
    ? `\nTavily's Direct Answer: ${searchData.answer}\n\n`
    : "";

  const sourcesTable =
    `\n\n## Sources\n| Number | Source | Description |\n|---------|---------|-------------|\n` +
    results
      .map(
        (result: SearchResult, index: number) =>
          `| ${index + 1} | [${result.title}](${result.url}) | ${
            result.snippet || result.content.slice(0, 150)
          }${result.content.length > 150 ? "..." : ""} |`
      )
      .join("\n");

  const reasoningInput = `Here is the research data:${tavilyAnswer}\n${searchContext}\n\nPlease analyze this information and create a detailed report addressing the original query: "${query}". Include citations to the sources where appropriate. If the sources contain any potential biases or conflicting information, please note that in your analysis.\n\nIMPORTANT: Always end your response with a sources table listing all references used. Format it exactly as shown below:\n${sourcesTable}`;

  return { reasoningInput, sourcesTable };
};

export const handleSearchError = (
  error: unknown,
  sectionIndex: number,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setChatSections: React.Dispatch<React.SetStateAction<ChatSection[]>>
) => {
  if (error instanceof Error && error.name === "AbortError") {
    console.log("Request was aborted");
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error:", error);
    setError(errorMessage);

    setChatSections((prev) => {
      const updated = [...prev];
      if (updated[sectionIndex]) {
        updated[sectionIndex] = {
          ...updated[sectionIndex],
          error: errorMessage,
          isLoadingSources: false,
          isLoadingThinking: false,
        };
      }
      return updated;
    });
  }
};
