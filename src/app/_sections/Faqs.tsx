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
                notSoDumb is an AI-powered content research assistant that helps
                you gather, analyze, and synthesize information from various
                sources. It uses advanced language models to understand your
                queries and provide comprehensive, well-researched responses
                with proper citations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-2">
              <AccordionTrigger>
                How accurate and reliable are the AI-generated responses?
              </AccordionTrigger>
              <AccordionContent>
                Our AI system provides highly accurate responses by combining
                advanced language models with real-time web search capabilities.
                Each response includes citations to source materials, allowing
                you to verify the information. However, we recommend reviewing
                the sources and using critical judgment for crucial decisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="mb-2" value="item-3">
              <AccordionTrigger>
                What about data privacy and security?
              </AccordionTrigger>
              <AccordionContent>
                We take data privacy seriously. Your queries and usage data are
                handled securely, and we don&apos;t store sensitive personal
                information. Our AI processing follows industry best practices
                for data protection, and we&apos;re transparent about our data
                handling policies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                What are the usage limits and pricing plans?
              </AccordionTrigger>
              <AccordionContent>
                We offer flexible pricing plans to suit different needs, from
                individual researchers to enterprise users. Each plan includes a
                monthly token allocation, with the ability to upgrade or
                purchase additional tokens as needed. Check our pricing section
                for detailed information about plans and features.
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
                    Next-Gen
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div>
    </div>
  );
}
