import clsx from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-[var(--border-default)] border-t-[var(--primary)]",
        spinnerSizes[size]
      )}
    />
  );
}