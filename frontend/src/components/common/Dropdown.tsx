import type { DropdownOption } from "../../types/ui";

interface DropdownProps<T extends string = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}

export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: DropdownProps<T>) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background-card)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)]"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}