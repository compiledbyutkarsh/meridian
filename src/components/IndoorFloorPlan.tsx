import type { CampusGraph, IndoorNode, NodeId } from "../types/graph";

interface IndoorFloorPlanProps {
  graph: CampusGraph;
  buildingId: string;
  floor: number;
  path: NodeId[];
  startId: NodeId | null;
  endId: NodeId | null;
}

function isIndoorNode(node: CampusGraph["nodes"][number]): node is IndoorNode {
  return node.location === "indoor";
}

export function IndoorFloorPlan({
  graph,
  buildingId,
  floor,
  path,
  startId,
  endId,
}: IndoorFloorPlanProps) {
  const floorNodes = graph.nodes
    .filter(isIndoorNode)
    .filter((node) => node.buildingId === buildingId && node.floor === floor);

  const floorNodeIds = new Set(floorNodes.map((n) => n.id));

  const floorEdges = graph.edges.filter(
    (edge) => floorNodeIds.has(edge.from) && floorNodeIds.has(edge.to)
  );

  const nodeById = new Map(floorNodes.map((n) => [n.id, n]));

  const pathOnThisFloor = path.filter((id) => floorNodeIds.has(id));
  const routePoints = pathOnThisFloor
    .map((id) => nodeById.get(id))
    .filter((n): n is IndoorNode => Boolean(n));

  return (
    <svg viewBox="0 0 600 400" className="floor-plan">
      <rect x={0} y={0} width={600} height={400} className="floor-plan-bg" />

      {floorEdges.map((edge) => {
        const a = nodeById.get(edge.from);
        const b = nodeById.get(edge.to);
        if (!a || !b) return null;
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className="floor-plan-edge"
          />
        );
      })}

      {routePoints.length > 1 && (
        <polyline
          points={routePoints.map((n) => `${n.x},${n.y}`).join(" ")}
          className="floor-plan-route"
        />
      )}

      {floorNodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.id === startId || node.id === endId ? 10 : 7}
            className={
              node.id === startId
                ? "floor-plan-node-start"
                : node.id === endId
                ? "floor-plan-node-end"
                : "floor-plan-node"
            }
          />
          <text x={node.x} y={node.y - 14} className="floor-plan-label">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
