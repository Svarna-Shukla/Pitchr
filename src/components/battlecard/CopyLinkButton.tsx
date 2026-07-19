import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import Button from "../Button";

// Copies the current page URL to the clipboard and briefly confirms with a checkmark
export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  // Writes the current location to the clipboard and flashes the copied state for 1.5s
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — silently no-op
    }
  };

  return (
    <Button variant="ghost" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy Link"}
    </Button>
  );
}
