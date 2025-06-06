import PricingPlan from "@/components/PricingPlan";

export default function Pricing() {
  return (
    <section className="border-b-border dark:border-b-darkBorder inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
      <div className="mx-auto w-container max-w-full px-5 py-20 lg:py-[100px]">
        <h2 className="mb-14 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Choose Your Second Brain Plan
        </h2>
        <div className="grid grid-cols-1 gap-8 mx-auto w-full md:w-2/3 lg:w-full lg:grid-cols-3 max-w-7xl">
          <PricingPlan
            planName="Student"
            description="Perfect for individual learners and researchers"
            price="29"
            perks={[
              "50 web-powered LLM searches per month",
              "20 quiz generations from any source",
              "1GB second brain storage",
              "Basic source integration",
              "Standard response time",
              "Community support",
            ]}
          />
          <PricingPlan
            planName="Pro"
            description="Ideal for educators and serious learners"
            price="99"
            perks={[
              "Unlimited web-powered LLM searches",
              "100 quiz generations per month",
              "10GB second brain storage",
              "Advanced source integration",
              "Quiz & research analytics",
              "Priority support",
              "Team sharing capabilities",
            ]}
            mostPopular
          />
          <PricingPlan
            planName="Enterprise"
            description="For educational institutions and organizations"
            price="299"
            perks={[
              "Unlimited web-powered searches & quiz generation",
              "100GB shared second brain storage",
              "Custom integration with existing systems",
              "Advanced analytics dashboard",
              "API access for custom applications",
              "Dedicated support team",
              "Enterprise-grade security",
              "Unlimited team members",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
