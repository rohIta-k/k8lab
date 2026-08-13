import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "reactflow";

import { COLORS } from "../../../constants/colors";

export default function TopologyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  animated,
}: EdgeProps) {
  const [path] =
    getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{
        stroke: COLORS.border.default,
        strokeWidth: 2,
        strokeDasharray: animated
          ? "6 4"
          : undefined,
      }}
    />
  );
}