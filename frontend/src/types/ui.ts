export type Theme = "dark";

export interface ModalState {
  open: boolean;
}

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export interface SearchState {
  value: string;
}

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface TableColumn {
  id: string;
  label: string;
  width?: number | string;
}

export interface SidebarState {
  collapsed: boolean;
}

export interface TopbarState {
  search: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "warning" | "error" | "info";
}