import { haversineDistance } from "./geo";
import type { CampusGraph, OutdoorNode } from "../types/graph";

export const MY_LOCATION_ID = "my_location";

export function withUserLocation(
  graph: CampusGraph,
  userLocation: { lat: number; lng: number }
): CampusGraph {
  const outdoorNodes = graph.nodes.filter(
    (n): n is OutdoorNode => n.location === "outdoor"
  );

  let nearest = outdoorNodes[0];
  let nearestDistance = Infinity;

  for (const node of outdoorNodes) {
    const distance = haversineDistance(userLocation, node);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = node;
    }
  }

  const myLocationNode: OutdoorNode = {
    id: MY_LOCATION_ID,
    label: "My Location",
    location: "outdoor",
    kind: "landmark",
    lat: userLocation.lat,
    lng: userLocation.lng,
  };

  return {
    nodes: [...graph.nodes, myLocationNode],
    edges: [
      ...graph.edges,
      { from: MY_LOCATION_ID, to: nearest.id, distance: nearestDistance },
    ],
  };
}
