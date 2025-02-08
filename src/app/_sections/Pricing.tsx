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
            description="Perfect for students and individual researchers"
            price="29"
            perks={[
              "50 AI-powered quizzes per month",
              "Web-enhanced research queries",
              "Basic quiz sharing features",
              "Community support",
              "Standard response time",
            ]}
          />
          <PricingPlan
            planName="Pro"
            description="Ideal for educators and research teams"
            price="99"
            perks={[
              "Unlimited AI-powered quizzes",
              "Advanced research capabilities",
              "Premium quiz templates",
              "Priority support",
              "Quiz analytics dashboard",
              "Team sharing features",
            ]}
            mostPopular
          />
          <PricingPlan
            planName="Enterprise"
            description="For educational institutions and organizations"
            price="299"
            perks={[
              "Custom quiz generation models",
              "Advanced research API access",
              "Dedicated support team",
              "Enterprise-grade security",
              "Custom integrations",
              "Advanced analytics",
              "Unlimited team members",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
