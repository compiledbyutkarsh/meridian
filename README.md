# Meridian 🧭

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

Real-time campus navigation built for Amity University, Noida. Finds the shortest route between any two points on campus — outdoors or inside a building — using a single unified graph model of real map data.

---

## ✨ Features

- 🗺️ **Real campus map** — built on Leaflet + OpenStreetMap tiles, centered on Amity University Noida's actual coordinates.
- 🏢 **Indoor navigation** — building interiors modeled as SVG floor plans, with rooms, corridors, and stairs as graph nodes.
- 🧩 **Unified graph model** — outdoor landmarks and indoor rooms live in the same graph. Building entrances are the bridge between the two, so a single route can start outside and end at a specific room.
- 📏 **Real-world distances** — outdoor edge weights computed via the haversine formula from actual lat/lng coordinates; indoor edges weighted by estimated walking distance.
- 🔍 **Dijkstra's algorithm** — shortest-path routing implemented from scratch, no pathfinding library, running over the full outdoor + indoor graph.
- 🎯 **Smart view switching** — the app automatically shows the map for outdoor routes and switches to the relevant floor plan the moment a route enters a building.
- 🧭 **Turn-by-turn directions** — step-by-step walking instructions generated from the route's geometry, with left/right/straight calculated from bearing changes between segments.
- 📍 **Live location tracking** — your real GPS position becomes a routable node, snapped to the nearest point on the campus graph, so you can navigate from wherever you're actually standing.

---

## 🏗️ Architecture

The campus is modeled as a single weighted, undirected graph with two kinds of nodes:

- **Outdoor nodes** — gates, blocks, and landmarks, positioned by real latitude/longitude.
- **Indoor nodes** — rooms, corridors, and stairs, positioned by local x/y coordinates within a building's floor plan.

Every edge — indoor or outdoor — is just a weighted connection between two node IDs, so Dijkstra's algorithm doesn't need to know or care which world a node belongs to. Building entrances are the nodes that connect both graphs, which is what lets a single query like "Main Gate → Room 103" return one continuous route spanning outdoor pavement and indoor corridors.

Rendering is what actually differs: outdoor nodes are drawn on the Leaflet map, indoor nodes are drawn on an SVG floor plan. The app picks whichever view matches where the current route actually goes.

---

## 🛠️ Tech Stack

| Component | Library |
|---|---|
| UI framework | React + TypeScript |
| Build tool | Vite |
| Outdoor map rendering | Leaflet (OpenStreetMap tiles) |
| Indoor map rendering | Custom SVG floor plans |
| Pathfinding | Custom Dijkstra implementation |
| Distance calculation | Haversine formula |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+

### Run locally
```bash
git clone https://github.com/compiledbyutkarsh/meridian.git
cd meridian
npm install
npm run dev
```

---

## 🗺️ Roadmap

- [x] Outdoor pathfinding with real campus coordinates
- [x] Dijkstra's shortest-path routing
- [x] Interactive map with route visualization
- [x] Indoor navigation (SVG floor plans, room-level)
- [x] Unified outdoor + indoor routing with smart view switching
- [x] Turn-by-turn walking directions with bearing-based turn detection
- [x] Live location tracking (GPS-based "you are here") as a routable starting point
- [ ] Search with autocomplete
- [ ] Mobile-responsive layout

---

Built by [compiledbyutkarsh](https://github.com/compiledbyutkarsh)
