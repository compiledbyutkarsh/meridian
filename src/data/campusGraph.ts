import { haversineDistance } from "../lib/geo";
import type { CampusGraph, CampusNode } from "../types/graph";

const rawNodes: CampusNode[] = [
  { id: "main_gate", label: "Main Gate", lat: 28.542, lng: 77.3315, kind: "gate" },
  { id: "central_library", label: "Central Library", lat: 28.5432, lng: 77.3325, kind: "building" },
  { id: "admin_block", label: "Admin Block", lat: 28.5436, lng: 77.3328, kind: "building" },
  { id: "block_a", label: "Block A", lat: 28.544, lng: 77.333, kind: "building" },
  { id: "block_b", label: "Block B", lat: 28.5445, lng: 77.3335, kind: "building" },
  { id: "j_block_biotech", label: "J Block (Biotech)", lat: 28.5433, lng: 77.3342, kind: "building" },
  { id: "food_court", label: "Food Court", lat: 28.5437, lng: 77.334, kind: "landmark" },
  { id: "amphitheatre", label: "Amphitheatre", lat: 28.5443, lng: 77.3345, kind: "landmark" },
  { id: "sports_complex", label: "Sports Complex", lat: 28.545, lng: 77.332, kind: "landmark" },
  { id: "hostel_gate", label: "Hostel Gate", lat: 28.5455, lng: 77.335, kind: "gate" },
];

const rawEdges: [string, string][] = [
  ["main_gate", "central_library"],
  ["main_gate", "block_a"],
  ["main_gate", "sports_complex"],
  ["central_library", "admin_block"],
  ["central_library", "block_a"],
  ["admin_block", "block_a"],
  ["sports_complex", "block_a"],
  ["block_a", "block_b"],
  ["block_a", "food_court"],
  ["block_b", "food_court"],
  ["block_b", "amphitheatre"],
  ["block_b", "hostel_gate"],
  ["food_court", "amphitheatre"],
  ["food_court", "j_block_biotech"],
  ["amphitheatre", "hostel_gate"],
];

const nodesById = new Map(rawNodes.map((node) => [node.id, node]));

export const campusGraph: CampusGraph = {
  nodes: rawNodes,
  edges: rawEdges.map(([from, to]) => {
    const a = nodesById.get(from)!;
    const b = nodesById.get(to)!;
    return { from, to, distance: haversineDistance(a, b) };
  }),
};

export const CAMPUS_CENTER = { lat: 28.5439106, lng: 77.3331085 };
