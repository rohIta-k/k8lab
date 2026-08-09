import {
  Maximize,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import Button from "../common/Button";

interface TopologyControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
}

export default function TopologyControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
}: TopologyControlsProps) {
  return (
    <div className="absolute left-6 top-6 z-20 flex gap-2">
      <Button
        variant="secondary"
        onClick={onZoomIn}
      >
        <Plus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={onZoomOut}
      >
        <Minus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={onFitView}
      >
        <Maximize size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={onReset}
      >
        <RotateCcw size={16} />
      </Button>
    </div>
  );
}