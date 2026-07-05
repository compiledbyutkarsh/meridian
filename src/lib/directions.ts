import { bearing } from "./geo";
import type { CampusGraph, CampusNode, NodeId } from "../types/graph";

export interface DirectionStep {
  text: string;
  distance: number;
}

function planarBearing(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (angle + 360) % 360;
}

function headingBetween(a: CampusNode, b: CampusNode): number | null {
  if (a.location === "outdoor" && b.location === "outdoor") {
    return bearing(a, b);
  }
  if (a.location === "indoor" && b.location === "indoor") {
    return planarBearing(a, b);
  }
  return null;
}

function classifyTurn(prevHeading: number, nextHeading: number): string {
  let diff = nextHeading - prevHeading;
  diff = ((diff + 540) % 360) - 180;

  if (Math.abs(diff) > 150) return "turn around";
  if (diff >= 30) return "turn right";
  if (diff <= -30) return "turn left";
  return "continue straight";
}

function edgeDistance(graph: CampusGraph, from: NodeId, to: NodeId): number {
  const edge = graph.edges.find(
    (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );
  return edge?.distance ?? 0;
}

export function generateDirections(
  graph: CampusGraph,
  path: NodeId[]
): DirectionStep[] {
  const nodes = path
    .map((id) => graph.nodes.find((n) => n.id === id))
    .filter((n): n is CampusNode => Boolean(n));

  if (nodes.length === 0) return [];

  const steps: DirectionStep[] = [
    { text: `Start at ${nodes[0].label}`, distance: 0 },
  ];

  let previousHeading: number | null = null;

  for (let i = 1; i < nodes.length; i++) {
    const from = nodes[i - 1];
    const to = nodes[i];
    const distance = edgeDistance(graph, from.id, to.id);
    const crossingThreshold = from.location !== to.location;

    let text: string;

    if (crossingThreshold) {
      text =
        to.location === "indoor"
          ? `Enter the building`
          : `Head outside`;
      previousHeading = null;
    } else {
      const heading = headingBetween(from, to);
      if (heading !== null && previousHeading !== null) {
        const turn = classifyTurn(previousHeading, heading);
        text =
          turn === "continue straight"
            ? `Continue toward ${to.label}`
            : `${turn === "turn left" ? "Turn left" : turn === "turn right" ? "Turn right" : "Turn around"}, then head toward ${to.label}`;
      } else {
        text = `Head toward ${to.label}`;
      }
      previousHeading = heading;
    }

    steps.push({ text, distance });
  }

  const last = steps[steps.length - 1];
  last.text = `Arrive at ${nodes[nodes.length - 1].label}`;

  return steps;
}
