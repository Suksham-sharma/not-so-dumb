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
                notSoDumb is a dual-purpose AI platform that combines advanced
                research capabilities with intelligent quiz generation. It uses
                web-powered LLM technology to provide referenced answers and
                create customized quizzes from various sources including YouTube
                videos and articles.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-2">
              <AccordionTrigger>
                How does the quiz generation feature work?
              </AccordionTrigger>
              <AccordionContent>
                Our quiz generation system allows you to create custom quizzes
                from any content source. Simply provide a YouTube video link,
                article URL, or your own research material, and our AI will
                generate relevant questions and answers. You can customize quiz
                difficulty and format, and easily share quizzes with others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-3">
              <AccordionTrigger>
                How accurate and reliable are the research responses?
              </AccordionTrigger>
              <AccordionContent>
                Our web-powered LLM technology provides highly accurate
                responses by combining advanced language models with real-time
                web data integration. Every answer includes verifiable sources
                and citations, allowing you to check the information&apos;s
                credibility and accuracy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                What are the usage limits and pricing plans?
              </AccordionTrigger>
              <AccordionContent>
                We offer flexible pricing plans to suit different needs. Each
                plan includes monthly token allocations for both research
                queries and quiz generation. You can create and share unlimited
                quizzes, with additional features like custom API endpoints and
                advanced analytics available in higher tiers.
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
                    AI-Powered Research & Quiz Platform
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div>
    </div>
  );
}
