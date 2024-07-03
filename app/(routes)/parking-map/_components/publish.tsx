import { useState } from "react";
import { Copy, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export const Publish = () => {
  const baseUrl = window.location.href + "-public-view";
  const [copied, setCopied] = useState(false);

  // Remove "/parking-map-public-view" from the URL if it exists
  const url = baseUrl.replace(/\/parking-map\b/g, "");

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          Share
          {copied ? (
            <Check className="text-primary w-4 h-4 ml-2" />
          ) : (
            <Globe className="w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 border border-primary"
        align="end"
        alignOffset={8}
        forceMount
      >
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            {copied ? (
              <Check className="text-primary animate-pulse h-4 w-4" />
            ) : (
              <Globe className="text-primary h-4 w-4" />
            )}
            <p className="text-xs font-medium text-primary">
              {copied ? "URL Copied!" : "Copy shareable URL"}
            </p>
          </div>
          <div className="flex items-center">
            <input
              className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
              value={url}
              disabled
            />
            <Button
              onClick={onCopy}
              disabled={copied}
              className="h-8 rounded-l-none"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
