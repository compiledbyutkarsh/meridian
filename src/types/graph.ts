export type NodeId = string;

export interface OutdoorNode {
  id: NodeId;
  label: string;
  location: "outdoor";
  kind: "gate" | "building" | "junction" | "landmark";
  lat: number;
  lng: number;
}

export interface IndoorNode {
  id: NodeId;
  label: string;
  location: "indoor";
  kind: "room" | "corridor" | "stairs" | "entrance";
  buildingId: string;
  floor: number;
  x: number;
  y: number;
}

export type CampusNode = OutdoorNode | IndoorNode;

export interface CampusEdge {
  from: NodeId;
  to: NodeId;
  distance: number;
}

export interface CampusGraph {
  nodes: CampusNode[];
  edges: CampusEdge[];
}

export interface Building {
  id: string;
  label: string;
  floors: number[];
}
