"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageDisplay } from "./ImageDisplay";
import { LiquidMetalCard } from "@/components/ui/liquid-metal-card";
import { cn } from "@/lib/utils";
import { ProviderKey } from "@/lib/provider-config";
import { ImageResult, ProviderTiming } from "@/lib/image-types";

interface ImageCarouselProps {
  providers: ProviderKey[];
  images: ImageResult[];
  timings: Record<ProviderKey, ProviderTiming>;
  failedProviders: ProviderKey[];
  enabledProviders: Record<ProviderKey, boolean>;
  providerToModel: Record<ProviderKey, string>;
}

export function ImageCarousel(props: Readonly<ImageCarouselProps>) {
  const {
    providers,
    images,
    timings,
    failedProviders,
    enabledProviders,
    providerToModel,
  } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {providers.map((provider, i) => {
            const imageData = images?.find(
              (img) => img.provider === provider,
            )?.image;
            const timing = timings[provider];

            const isSelected = i === currentSlide;

            return (
              <CarouselItem key={provider}>
                <div
                  className={cn(
                    "relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 border-[4px] border-transparent",
                    isSelected
                      ? "border-[#e879f9] ring-[4px] ring-[#e879f9] ring-offset-4 ring-offset-black shadow-[0_0_30px_rgba(232,121,249,0.9)] scale-[1.02]"
                      : ""
                  )}
                  data-selected={isSelected ? "true" : undefined}
                >
                  <LiquidMetalCard
                    speed={0.6}
                    className="w-full h-full p-[3px] rounded-[calc(1rem-1px)]"
                  >
                    <div className="relative w-full h-full rounded-[calc(1rem-2px)] overflow-hidden">
                      <ImageDisplay
                        modelId={
                          images?.find((img) => img.provider === provider)?.modelId ||
                          providerToModel[provider]
                        }
                        provider={provider}
                        image={imageData}
                        timing={timing}
                        failed={failedProviders.includes(provider)}
                        enabled={enabledProviders[provider]}
                      />
                    </div>
                  </LiquidMetalCard>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  {i + 1} of {providers.length}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm" />
        <CarouselNext className="right-0 bg-background/80 backdrop-blur-sm" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="absolute -bottom-6 left-0 right-0">
        <div className="flex justify-center gap-1">
          {providers.map((provider, index) => (
            <button
              key={provider}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentSlide
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-primary/50",
              )}
              onClick={() => api?.scrollTo(index)}
            >
              <span className="sr-only">Go to image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
