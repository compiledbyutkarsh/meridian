import { useEffect, useRef } from "react";
import L from "leaflet";
import type { CampusGraph, NodeId } from "../types/graph";
import { CAMPUS_CENTER } from "../data/campusGraph";

interface CampusMapProps {
  graph: CampusGraph;
  path: NodeId[] | null;
  startId: NodeId | null;
  endId: NodeId | null;
}

export function CampusMap({ graph, path, startId, endId }: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(
      [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
      17
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 20,
    }).addTo(map);

    const edgeLayer = L.layerGroup().addTo(map);
    for (const edge of graph.edges) {
      const from = graph.nodes.find((n) => n.id === edge.from);
      const to = graph.nodes.find((n) => n.id === edge.to);
      if (!from || !to) continue;

      L.polyline(
        [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
        { color: "#94a3b8", weight: 2, opacity: 0.5 }
      ).addTo(edgeLayer);
    }

    const nodeLayer = L.layerGroup().addTo(map);
    for (const node of graph.nodes) {
      L.circleMarker([node.lat, node.lng], {
        radius: 7,
        color: "#1e293b",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 2,
      })
        .bindPopup(node.label)
        .addTo(nodeLayer);
    }

    routeLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
  }, [graph]);

  useEffect(() => {
    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (!path || path.length === 0) return;

    const coords = path
      .map((id) => graph.nodes.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n))
      .map((n) => [n.lat, n.lng] as [number, number]);

    L.polyline(coords, { color: "#f97316", weight: 5, opacity: 0.9 }).addTo(
      routeLayer
    );

    for (const id of [startId, endId]) {
      const node = graph.nodes.find((n) => n.id === id);
      if (!node) continue;

      L.circleMarker([node.lat, node.lng], {
        radius: 9,
        color: "#1e293b",
        fillColor: id === startId ? "#22c55e" : "#ef4444",
        fillOpacity: 1,
        weight: 2,
      }).addTo(routeLayer);
    }

    map.fitBounds(coords, { padding: [40, 40] });
  }, [path, startId, endId, graph]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
