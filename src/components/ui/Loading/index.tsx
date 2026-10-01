import { cn } from "@/utils/cn";

interface LoadingProps {
  fullPage?: boolean;
  className?: string;
}

const Loading = ({ fullPage = false, className }: LoadingProps) => {
  const content = (
    <p className="flex-center gap-3">
      <span
        data-testid="loading-animation"
        className="loading loading-spinner text-primary"
      />
      <span className="text-xl font-medium">載入中</span>
    </p>
  );

  if (fullPage)
    return (
      <div
        data-testid="loading-container"
        className={cn(
          "flex-center min-h-screen w-full flex-1 flex-col gap-4 p-20",
          className
        )}
      >
        {content}
      </div>
    );

  return (
    <div
      data-testid="loading-container"
      className={cn("flex-center min-h-[50vh] w-full gap-2 py-8", className)}
    >
      {content}
    </div>
  );
};

export default Loading;
