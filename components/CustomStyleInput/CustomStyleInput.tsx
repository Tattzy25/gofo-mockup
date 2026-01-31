 import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CustomStyleInputProps {
  isVisible: boolean;
  onSubmit: (customStyle: string) => void;
  placeholder?: string;
}

export function CustomStyleInput({
  isVisible,
  onSubmit,
  placeholder = "Enter your custom style...",
}: Readonly<CustomStyleInputProps>) {
  const [inputValue, setInputValue] = useState("");

  if (!isVisible) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="mt-4 px-4 pb-[10px] w-full max-w-4xl mx-auto flex justify-center">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-lg">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          autoFocus
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost"
          disabled={!inputValue.trim()}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
 