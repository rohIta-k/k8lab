import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;

  className?: string;

  onClick?: () => void;
}

export default function Card({
  children,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-2xl border border-[var(--border-default)] bg-[var(--background-card)] p-6 shadow-sm",
        onClick &&
          "cursor-pointer transition-colors hover:border-[var(--primary)]",
        className
      )}
    >
      {children}
    </div>
  );
}