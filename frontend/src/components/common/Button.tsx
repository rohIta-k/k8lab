import clsx from "clsx";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variants = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",

  secondary:
    "border border-[var(--border-color)] bg-[var(--background-card)] text-[var(--text-primary)] hover:bg-[var(--background-hover)]",

  danger:
    "bg-[var(--danger)] text-white hover:opacity-90",

  ghost:
    "text-[var(--text-secondary)] hover:bg-[var(--background-hover)]",
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}