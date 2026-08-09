import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;

  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "secondary";

  className?: string;
}

const variants = {
  primary:
    "border-[var(--primary)] bg-[var(--background-hover)] text-[var(--primary)]",

  success:
    "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]",

  warning:
    "border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning)]",

  danger:
    "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]",

  info:
    "border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info)]",

  secondary:
    "border-[var(--border-color)] bg-[var(--background-hover)] text-[var(--text-secondary)]",
};

export default function Badge({
  children,
  variant = "primary",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}