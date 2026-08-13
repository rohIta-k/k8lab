import {
  Maximize,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import { useReactFlow } from "reactflow";

import Button from "../common/Button";

export default function TopologyControls() {
  const {
    zoomIn,
    zoomOut,
    fitView,
    setViewport,
  } = useReactFlow();

  const handleReset = () => {
    setViewport({
      x: 0,
      y: 0,
      zoom: 1,
    });
  };

  return (
    <div className="absolute left-6 top-6 z-20 flex gap-2">
      <Button
        variant="secondary"
        onClick={() => zoomIn()}
        aria-label="Zoom in"
      >
        <Plus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={() => zoomOut()}
        aria-label="Zoom out"
      >
        <Minus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={() => fitView()}
        aria-label="Fit topology"
      >
        <Maximize size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={handleReset}
        aria-label="Reset view"
      >
        <RotateCcw size={16} />
      </Button>
    </div>
  );
}