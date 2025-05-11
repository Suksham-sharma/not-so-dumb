import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Marquee from "react-fast-marquee";

export default function Faq() {
  return (
    <div>
      <section className=" dark:bg-darkBg bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mx-auto grid w-[700px] max-w-full px-5">
          <Accordion className="text-base sm:text-lg" type="single" collapsible>
            <AccordionItem className="mb-2" value="item-1">
              <AccordionTrigger>
                What is notSoDumb and how does it work?
              </AccordionTrigger>
              <AccordionContent>
                notSoDumb is an all-in-one solution for study, research, and
                knowledge management. It combines web-powered LLM search for
                accurate research, quiz generation from any source (articles,
                YouTube videos, PDFs), and a second brain functionality that
                stores and interacts with all your notes, links, and resources.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-2">
              <AccordionTrigger>
                How does the web-powered LLM search work?
              </AccordionTrigger>
              <AccordionContent>
                Our web-powered LLM search combines advanced language models
                with real-time web data integration to provide accurate,
                up-to-date answers to your research questions. Every response
                includes verifiable sources and citations, allowing you to check
                the information&apos;s credibility and dig deeper into topics
                that interest you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-3">
              <AccordionTrigger>
                What content sources can I use for quiz generation?
              </AccordionTrigger>
              <AccordionContent>
                You can generate quizzes from virtually any content source:
                YouTube videos, articles, PDFs, websites, and even your own
                notes stored in your second brain. Simply provide the source,
                and our AI will generate relevant questions and answers, with
                customizable difficulty levels and formats to match your
                learning preferences.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-4">
              <AccordionTrigger>
                What is the &quot;Second Brain&quot; feature and how does it
                work?
              </AccordionTrigger>
              <AccordionContent>
                The Second Brain is your personal knowledge repository where you
                can store all your notes, links, documents, and research
                findings in one place. What makes it special is that you can
                interact with it through conversation - ask questions about your
                stored content, make connections between different pieces of
                information, and get personalized insights based on your
                accumulated knowledge.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                What are the usage limits and pricing plans?
              </AccordionTrigger>
              <AccordionContent>
                We offer flexible pricing plans to suit different needs. Each
                plan includes allocations for web-powered searches, quiz
                generations, and second brain storage. Our Student plan is
                perfect for individual learners, the Pro plan suits educators
                and serious researchers, while the Enterprise plan provides
                unlimited features for organizations and educational
                institutions with advanced customization options.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder  border-y-2 bg-white py-3 font-base sm:py-5"
          direction="right"
        >
          {Array(10)
            .fill("xd")
            .map((x, id) => {
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
