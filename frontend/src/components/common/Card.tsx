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
        "rounded-[28px] border border-white/5 bg-[var(--background-card)] p-6 shadow-[0_16px_32px_rgba(0,0,0,0.22)] backdrop-blur-sm",
        onClick &&
          "cursor-pointer transition-all hover:-translate-y-0.5 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)]",
        className
      )}
    >
      {children}
    </div>
  );
}