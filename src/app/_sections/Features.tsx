import Marquee from "react-fast-marquee";

export default function Features() {
  const features = [
    {
      title: "Web-Enhanced Research",
      text: "Get accurate answers powered by advanced LLM technology with real-time web data integration and source verification.",
    },
    {
      title: "Smart Quiz Generation",
      text: "Create custom quizzes from any content source - YouTube videos, articles, or your research materials.",
    },
    {
      title: "Source Integration",
      text: "Seamlessly import content from YouTube videos and articles to generate targeted quizzes and study materials.",
    },
    {
      title: "Quiz Sharing",
      text: "Share your generated quizzes with others and collaborate on learning materials with easy-to-use sharing features.",
    },
    {
      title: "Referenced Answers",
      text: "Every research response comes with verifiable sources and citations, ensuring accuracy and credibility.",
    },
    {
      title: "Customizable Experience",
      text: "Tailor quiz difficulty, format, and content focus to match your specific learning or assessment needs.",
    },
  ];

  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Advanced AI Research & Quiz Generation Platform
        </h2>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            return (
              <div
                className="border-border dark:border-darkBorder shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5"
                key={i}
              >
                <h4 className="text-xl font-heading">{feature.title}</h4>
                <p>{feature.text}</p>
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
                    Research & Quiz Generation Platform
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div>
    </div>
  );
}
