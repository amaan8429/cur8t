import { toast } from "@/hooks/use-toast";
import {PiClock, PiWarning} from "react-icons/pi";

interface RateLimitToastProps {
  retryAfter?: number;
  message?: string;
}

export const showRateLimitToast = ({
  retryAfter = 60,
  message = "Too many requests. Please wait before trying again.",
}: RateLimitToastProps = {}) => {
  const formatRetryTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  toast({
    title: "Rate Limit Reached",
    description: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <PiWarning className="h-4 w-4 text-amber-500" />
          <span>{message}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PiClock className="h-3 w-3" />
          <span>Try again in {formatRetryTime(retryAfter)}</span>
        </div>
      </div>
    ),
    variant: "destructive",
    duration: retryAfter > 60 ? 10000 : 5000, // Show longer for longer wait times
  });
};

export const showRateLimitToastWithCountdown = ({
  retryAfter = 60,
  message = "Too many requests. Please wait before trying again.",
}: RateLimitToastProps = {}) => {
  let remainingTime = retryAfter;

  const updateToast = () => {
    const formatRetryTime = (seconds: number) => {
      if (seconds < 60) return `${seconds} seconds`;
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    };

    toast({
      title: "Rate Limit Reached",
      description: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <PiWarning className="h-4 w-4 text-amber-500" />
            <span>{message}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PiClock className="h-3 w-3" />
            <span>Try again in {formatRetryTime(remainingTime)}</span>
          </div>
        </div>
      ),
      variant: "destructive",
      duration: 2000,
    });
  };

  // Initial toast
  updateToast();

  // Update every 10 seconds for the first minute, then every minute
  const interval = setInterval(
    () => {
      remainingTime -= remainingTime > 60 ? 60 : 10;

      if (remainingTime <= 0) {
        clearInterval(interval);
        toast({
          title: "Ready to Try Again",
          description:
            "Rate limit has been reset. You can now make requests again.",
          duration: 3000,
        });
        return;
      }

      updateToast();
    },
    remainingTime > 60 ? 60000 : 10000
  );

  return () => clearInterval(interval);
};
