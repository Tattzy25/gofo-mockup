import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, Settings } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ImageDisplay } from "./ImageDisplay";
import { ImageCarousel } from "@/components/ImageCarousel";
import { GeneratedImage, ImageError, ProviderTiming } from "@/lib/image-types";
import {
  PROVIDER_ORDER,
  ProviderKey,
  initializeProviderRecord,
} from "@/lib/provider-config";

interface ImageGeneratorProps {
  images: GeneratedImage[];
  errors: ImageError[];
  failedProviders: ProviderKey[];
  timings: Record<ProviderKey, ProviderTiming>;
  enabledProviders: Record<ProviderKey, boolean>;
  toggleView: () => void;
}

export function ImageGenerator({
  images,
  errors,
  failedProviders,
  timings,
  enabledProviders,
  toggleView,
}: ImageGeneratorProps) {
  return (
    <div className="space-y-6">
      {/* If there are errors, render a collapsible alert */}
      {errors.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              {errors.length} {errors.length === 1 ? "error" : "errors"}{" "}
              occurred
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 mt-2">
              {errors.map((err, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <div className="ml-3">
                    <AlertTitle className="capitalize">
                      {err.provider} Error
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-sm">
                      {err.message}
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Generated Images</h3>
        <Button
          variant="outline"
          className=""
          onClick={() => toggleView()}
          size="icon"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile layout: Carousel */}
      <div className="sm:hidden">
        <ImageCarousel
          providers={PROVIDER_ORDER}
          images={images}
          timings={timings}
          failedProviders={failedProviders}
          enabledProviders={enabledProviders}
          providerToModel={initializeProviderRecord<string>()}
        />
      </div>

      {/* Desktop layout: Fixed 2x2 grid of 4 slots (placeholders) */}
      <div className="hidden sm:grid sm:grid-cols-2 2xl:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((slot) => {
          const imageItem = images[slot];
          const providerKey = imageItem?.provider as ProviderKey | undefined;
          const imageData = imageItem?.image;
          const timing = providerKey ? timings[providerKey] : undefined;
          const failed = providerKey ? failedProviders.includes(providerKey) : false;
          const enabled = providerKey ? enabledProviders[providerKey] : true;
          return (
            <ImageDisplay
              key={`slot-${slot}`}
              provider={providerKey ?? `slot-${slot}`}
              image={imageData}
              timing={timing}
              failed={failed}
              enabled={enabled}
              modelId={imageItem?.modelId ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
