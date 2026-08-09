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
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: currentColor.background,
          }}
        >
          <Icon
            size={22}
            style={{
              color: currentColor.color,
            }}
          />
        </div>
      </div>
    </Card>
  );
}