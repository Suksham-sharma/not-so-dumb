import PricingPlan from "@/components/PricingPlan";

export default function Pricing() {
  return (
    <section className="border-b-border dark:border-b-darkBorder  inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
      <div className="mx-auto w-container max-w-full px-5 py-20 lg:py-[100px]">
        <h2 className="mb-14 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Choose Your AI Plan
        </h2>
        <div className="grid grid-cols-3 gap-8 w900:mx-auto w900:w-2/3 w900:grid-cols-1 w500:w-full">
          <PricingPlan
            planName="Starter"
            description="Perfect for individual developers and small projects"
            price="29"
            perks={[
              "100,000 tokens per month",
              "Access to base LLM model",
              "Standard API rate limits",
              "Community support",
              "Basic analytics dashboard",
            ]}
          />
          <PricingPlan
            planName="Pro"
            description="Ideal for growing businesses and AI applications"
            price="99"
            perks={[
              "1,000,000 tokens per month",
              "Access to advanced LLM models",
              "Priority API access",
              "24/7 email support",
              "Advanced analytics",
              "Custom API endpoints",
            ]}
            mostPopular
          />
          <PricingPlan
            planName="Enterprise"
            description="For large-scale AI implementations"
            price="299"
            perks={[
              "Unlimited tokens",
              "Access to all LLM models",
              "Dedicated API infrastructure",
              "24/7 priority support",
              "Custom model fine-tuning",
              "Advanced security features",
              "Enterprise SLA",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
