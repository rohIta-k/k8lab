import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export default function Tooltip({
  content,
  children,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={8}
            className="
              tooltip-enter
              z-50
              rounded-[var(--radius-md)]
              border
              border-[var(--border-color)]
              bg-[var(--background-card)]
              px-3
              py-2
              text-sm
              text-[var(--text-primary)]
              shadow-[var(--shadow-md)]
            "
          >
            {content}

            <TooltipPrimitive.Arrow
              className="fill-[var(--background-card)]"
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}