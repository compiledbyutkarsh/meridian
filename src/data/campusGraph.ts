import { haversineDistance } from "../lib/geo";
import type { Building, CampusGraph, CampusNode, OutdoorNode } from "../types/graph";

const outdoorNodes: OutdoorNode[] = [
  { id: "main_gate", label: "Main Gate", location: "outdoor", lat: 28.542, lng: 77.3315, kind: "gate" },
  { id: "central_library", label: "Central Library", location: "outdoor", lat: 28.5432, lng: 77.3325, kind: "building" },
  { id: "admin_block", label: "Admin Block", location: "outdoor", lat: 28.5436, lng: 77.3328, kind: "building" },
  { id: "block_a", label: "Block A", location: "outdoor", lat: 28.544, lng: 77.333, kind: "building" },
  { id: "block_b", label: "Block B", location: "outdoor", lat: 28.5445, lng: 77.3335, kind: "building" },
  { id: "j_block_biotech", label: "J Block (Biotech)", location: "outdoor", lat: 28.5433, lng: 77.3342, kind: "building" },
  { id: "food_court", label: "Food Court", location: "outdoor", lat: 28.5437, lng: 77.334, kind: "landmark" },
  { id: "amphitheatre", label: "Amphitheatre", location: "outdoor", lat: 28.5443, lng: 77.3345, kind: "landmark" },
  { id: "sports_complex", label: "Sports Complex", location: "outdoor", lat: 28.545, lng: 77.332, kind: "landmark" },
  { id: "hostel_gate", label: "Hostel Gate", location: "outdoor", lat: 28.5455, lng: 77.335, kind: "gate" },
];

const outdoorEdges: [string, string][] = [
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

const indoorNodes: CampusNode[] = [
  { id: "block_a_entrance", label: "Block A Entrance", location: "indoor", buildingId: "block_a", floor: 1, x: 60, y: 220, kind: "entrance" },
  { id: "block_a_corridor_1", label: "West Corridor", location: "indoor", buildingId: "block_a", floor: 1, x: 200, y: 220, kind: "corridor" },
  { id: "block_a_room_101", label: "Room 101", location: "indoor", buildingId: "block_a", floor: 1, x: 200, y: 100, kind: "room" },
  { id: "block_a_corridor_2", label: "East Corridor", location: "indoor", buildingId: "block_a", floor: 1, x: 380, y: 220, kind: "corridor" },
  { id: "block_a_room_102", label: "Room 102", location: "indoor", buildingId: "block_a", floor: 1, x: 380, y: 100, kind: "room" },
  { id: "block_a_room_103", label: "Room 103", location: "indoor", buildingId: "block_a", floor: 1, x: 480, y: 300, kind: "room" },
  { id: "block_a_stairs", label: "Stairs", location: "indoor", buildingId: "block_a", floor: 1, x: 520, y: 220, kind: "stairs" },
];

const indoorEdges: [string, string, number][] = [
  ["block_a", "block_a_entrance", 6],
  ["block_a_entrance", "block_a_corridor_1", 12],
  ["block_a_corridor_1", "block_a_room_101", 8],
  ["block_a_corridor_1", "block_a_corridor_2", 16],
  ["block_a_corridor_2", "block_a_room_102", 8],
  ["block_a_corridor_2", "block_a_room_103", 10],
  ["block_a_corridor_2", "block_a_stairs", 6],
];

const allNodes: CampusNode[] = [...outdoorNodes, ...indoorNodes];
const nodesById = new Map(allNodes.map((node) => [node.id, node]));

const outdoorEdgeList = outdoorEdges.map(([from, to]) => {
  const a = nodesById.get(from) as OutdoorNode;
  const b = nodesById.get(to) as OutdoorNode;
  return { from, to, distance: haversineDistance(a, b) };
});

const indoorEdgeList = indoorEdges.map(([from, to, distance]) => ({ from, to, distance }));

export const campusGraph: CampusGraph = {
  nodes: allNodes,
  edges: [...outdoorEdgeList, ...indoorEdgeList],
};

export const buildings: Building[] = [
  { id: "block_a", label: "Block A", floors: [1] },
];

export const CAMPUS_CENTER = { lat: 28.5439106, lng: 77.3331085 };
