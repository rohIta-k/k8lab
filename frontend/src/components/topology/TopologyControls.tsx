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
      >
        <Plus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={() => zoomOut()}
      >
        <Minus size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={() => fitView()}
      >
        <Maximize size={16} />
      </Button>

      <Button
        variant="secondary"
        onClick={handleReset}
      >
        <RotateCcw size={16} />
      </Button>
    </div>
  );
}