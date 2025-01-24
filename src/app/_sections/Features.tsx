import Marquee from "react-fast-marquee";

export default function Features() {
  const features = [
    {
      title: "Real-Time Web Data",
      text: "Access up-to-date information from across the internet, ensuring your responses are based on current and accurate data.",
    },
    {
      title: "Enhanced Context",
      text: "Understand queries better by leveraging web context and real-world information to provide more relevant answers.",
    },
    {
      title: "Source Verification",
      text: "Every response is backed by credible web sources, allowing you to verify information and trust the results.",
    },
    {
      title: "Smart Research",
      text: "Efficiently analyze multiple web sources to compile comprehensive answers to your questions in seconds.",
    },
    {
      title: "Bias Detection",
      text: "Identify and highlight potential biases in source materials, ensuring more balanced and objective responses.",
    },
    {
      title: "Dynamic Learning",
      text: "Continuously improve responses by learning from new web data and user interactions for better accuracy.",
    },
  ];

  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Powered by Advanced Web-Enhanced AI Technology
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
          ;
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
                    AI Research Assistant
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div>
    </div>
  );
}
