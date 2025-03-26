import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Settings } from "lucide-react";

interface HeroProps {
  url: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  toggleModal: () => void;
  isApiKeyValid: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  url,
  onInputChange,
  onButtonClick,
  toggleModal,
  isApiKeyValid
}) => {
  return (
    <section className="relative w-full overflow-hidden py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/0"></div>
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-[25%] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] translate-x-[30%] -translate-y-[10%] rounded-full bg-secondary/10 blur-[60px]"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="space-y-4 animate-fade-up">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-fade-in">
              YouTube Summarizer
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Supercharge Your</span>
              <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">
                YouTube Experience
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in animation-delay-300">
              Get concise, intelligent summaries of any YouTube video in seconds
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in animation-delay-600">
              <div className="w-full max-w-md glass-card rounded-full overflow-hidden shadow-sm">
                <div className="flex items-center bg-background/50 backdrop-filter backdrop-blur-sm">
                  <div className="pl-4 text-muted-foreground">
                    <Search size={18} />
                  </div>
                  <Input
                    type="text"
                    placeholder="Paste YouTube URL here..."
                    value={url}
                    onChange={onInputChange}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <Button
                  variant="daisyPrimary" 
                  onClick={onButtonClick} 
                  disabled={!isApiKeyValid}
                  // className="rounded-full px-4 py-2 h-10 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <span>Summarize</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={toggleModal}
                  className="rounded-full px-3 h-10 glass-card hover:bg-secondary/50"
                >
                  <Settings size={18} />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
