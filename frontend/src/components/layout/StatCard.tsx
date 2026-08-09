import type { LucideIcon } from "lucide-react";

import { COLORS } from "../../constants/colors";

import Card from "../common/Card";

type StatCardVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: StatCardVariant;
  subtitle?: string;
}

const iconColors: Record<
  StatCardVariant,
  {
    color: string;
    background: string;
  }
> = {
  primary: {
    color: COLORS.primary,
    background: `${COLORS.primary}20`,
  },
  success: COLORS.status.success,
  warning: COLORS.status.warning,
  danger: COLORS.status.danger,
  info: COLORS.status.info,
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  variant = "primary",
  subtitle,
}: StatCardProps) {
  const currentColor = iconColors[variant];

  return (
    <Card className="min-h-[122px] transition-all duration-200 hover:-translate-y-1">
      <div className="flex h-full items-start justify-between gap-4">
        <div>
          <p className="text-m text-[var(--text-secondary)]">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          <Icon
            size={20}
            style={{
              color: currentColor.color,
            }}
          />
        </div>
      </div>
    </Card>
  );
}