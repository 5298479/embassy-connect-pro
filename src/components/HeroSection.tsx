
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-embassy-primary sm:mt-10 sm:text-6xl">
              Simplify Your Embassy & Visa Process
            </h1>
            <p className="mt-6 text-lg leading-8 text-embassy-secondary">
              Streamline your embassy applications, document submissions, and visa verifications all in one secure platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/register">
                <Button className="bg-embassy-primary hover:bg-embassy-primary/90">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/embassies" className="text-sm font-semibold leading-6 text-embassy-secondary">
                View Embassies <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <div className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
            <div className="h-full w-full bg-gradient-to-br from-embassy-primary/10 to-embassy-accent/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
