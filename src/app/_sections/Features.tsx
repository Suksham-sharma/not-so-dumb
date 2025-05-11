import Marquee from "react-fast-marquee";

export default function Features() {
  const features = [
    {
      title: "Web-Powered LLM Search",
      text: "Get accurate, up-to-date answers powered by advanced LLM technology with real-time web data integration and comprehensive source verification.",
    },
    {
      title: "Intelligent Quiz Generation",
      text: "Transform any content into personalized quizzes - from YouTube videos and articles to PDFs and your own notes, customized to your learning needs.",
    },
    {
      title: "Interactive Second Brain",
      text: "Store all your notes, links, and resources in one place, then have meaningful conversations with an AI that has access to your entire knowledge base.",
    },
    {
      title: "Multi-Source Integration",
      text: "Seamlessly import content from YouTube videos, articles, PDFs, and websites to build your personal knowledge repository.",
    },
    {
      title: "Comprehensive Citations",
      text: "Every research response includes verifiable sources and citations, ensuring accuracy and enabling deeper exploration of topics.",
    },
    {
      title: "Personalized Learning",
      text: "Tailor your experience with customizable quiz formats, difficulty levels, and knowledge retrieval preferences to match your specific learning style.",
    },
  ];

  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Your Complete Research & Learning Ecosystem
        </h2>

        <div className="mx-auto grid w-container max-w-full grid-cols-2 gap-3 px-3 lg:grid-cols-3 lg:gap-5 lg:px-5">
          {features.map((feature, i) => {
            return (
              <div
                className="border-border dark:border-darkBorder shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-2 sm:p-3 md:p-5"
                key={i}
              >
                <h4 className="text-lg sm:text-xl font-heading">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-md">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder border-y-2 bg-white py-3 font-base sm:py-5"
          direction="left"
        >
          {Array(10)
            .fill(null)
            .map((_, id) => {
              return (
                <div className="flex items-center" key={id}>
                  <span className="mx-8 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Research • Quiz Generation • Second Brain
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div>
    </div>
  );
}
