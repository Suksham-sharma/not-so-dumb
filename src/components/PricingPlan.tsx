import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PricingPlan({
  perks,
  mostPopular = false,
  planName,
  description,
  price,
}: {
  perks: string[];
  mostPopular?: boolean;
  planName: string;
  description: string;
  price: string;
}) {
  return (
    <div className="border-border dark:border-darkBorder flex flex-col justify-between rounded-base border-2 bg-white p-4 sm:p-5 transition-transform hover:translate-y-[-4px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-heading">{planName}</h3>
          {mostPopular && (
            <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
              Most popular
            </span>
          )}
        </div>
        <p className="mb-3 mt-1 text-sm sm:text-base text-gray-600">{description}</p>
        <div>
          <span className="text-2xl sm:text-3xl font-heading">${price}</span>{" "}
          <span className="text-gray-600">/month</span>{" "}
        </div>
        <ul className="mt-6 sm:mt-8 flex flex-col gap-2">
          {perks.map((perk) => {
            return (
              <li key={perk} className="flex items-center gap-3 text-sm sm:text-base">
                <Check className="shrink-0" size={20} /> {perk}
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant={"default"}
        size={mostPopular ? "lg" : "default"}
        className={cn("mt-8 sm:mt-12 w-full shadow-neo hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all", mostPopular && "bg-main text-black font-bold")}
      >
        Buy Plan
      </Button>
    </div>
  );
}
