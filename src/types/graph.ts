export type NodeId = string;

export interface CampusNode {
  id: NodeId;
  label: string;
  lat: number;
  lng: number;
  kind: "gate" | "building" | "junction" | "landmark";
}

export interface CampusEdge {
  from: NodeId;
  to: NodeId;
  distance: number;
}

export interface CampusGraph {
  nodes: CampusNode[];
  edges: CampusEdge[];
}
