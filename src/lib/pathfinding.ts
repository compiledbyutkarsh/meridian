import type { CampusGraph, NodeId } from "../types/graph";

export interface RouteResult {
  path: NodeId[];
  distance: number;
}

function buildAdjacency(graph: CampusGraph) {
  const adjacency = new Map<NodeId, { neighbor: NodeId; distance: number }[]>();

  for (const node of graph.nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.from)?.push({ neighbor: edge.to, distance: edge.distance });
    adjacency.get(edge.to)?.push({ neighbor: edge.from, distance: edge.distance });
  }

  return adjacency;
}

export function findShortestPath(
  graph: CampusGraph,
  start: NodeId,
  end: NodeId
): RouteResult | null {
  const adjacency = buildAdjacency(graph);

  const distances = new Map<NodeId, number>();
  const previous = new Map<NodeId, NodeId>();
  const visited = new Set<NodeId>();

  for (const node of graph.nodes) {
    distances.set(node.id, Infinity);
  }
  distances.set(start, 0);

  while (visited.size < graph.nodes.length) {
    let current: NodeId | null = null;
    let currentDistance = Infinity;

    for (const [nodeId, distance] of distances) {
      if (!visited.has(nodeId) && distance < currentDistance) {
        current = nodeId;
        currentDistance = distance;
      }
    }

    if (current === null) break;
    if (current === end) break;

    visited.add(current);

    const neighbors = adjacency.get(current) ?? [];
    for (const { neighbor, distance } of neighbors) {
      if (visited.has(neighbor)) continue;

      const candidateDistance = currentDistance + distance;
      if (candidateDistance < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, candidateDistance);
        previous.set(neighbor, current);
      }
    }
  }

  if (distances.get(end) === Infinity) return null;

  const path: NodeId[] = [end];
  let step = end;
  while (step !== start) {
    const prev = previous.get(step);
    if (!prev) return null;
    path.unshift(prev);
    step = prev;
  }

  return { path, distance: distances.get(end) ?? 0 };
}
