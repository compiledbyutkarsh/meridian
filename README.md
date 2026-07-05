# Meridian 🧭

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

Real-time campus navigation built for Amity University, Noida. Finds the shortest walkable route between any two points on campus using a graph model of real map data.

---

## ✨ Features

- 🗺️ **Real campus map** — built on Leaflet + OpenStreetMap tiles, centered on Amity University Noida's actual coordinates.
- 🧩 **Graph-based world model** — campus landmarks (gates, blocks, courts, hostels) represented as nodes, walkable paths as weighted edges.
- 📏 **Real-world distances** — edge weights computed via the haversine formula from actual lat/lng coordinates, not arbitrary numbers.
- 🔍 **Dijkstra's algorithm** — shortest-path routing implemented from scratch, no pathfinding library.
- 🎯 **Visual routing** — selected route is drawn live on the map, with distinct start/end markers and total distance shown.

---

## 🏗️ Architecture

The campus is modeled as a weighted, undirected graph:

- **Nodes** — physical locations (Main Gate, Block A, Central Library, Sports Complex, etc.) with real latitude/longitude.
- **Edges** — walkable connections between nodes, weighted by real-world distance in meters.

When a route is requested, Dijkstra's algorithm runs over the adjacency list to find the minimum-distance path, which is then rendered as a polyline on the Leaflet map.

> This graph model is what makes indoor navigation (multi-floor, room-level) a natural extension — indoor nodes just plug into the same graph via building entrance points.

---

## 🛠️ Tech Stack

| Component | Library |
|---|---|
| UI framework | React + TypeScript |
| Build tool | Vite |
| Map rendering | Leaflet (OpenStreetMap tiles) |
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
- [ ] Indoor navigation (multi-floor, room-level)
- [ ] Search with autocomplete
- [ ] Turn-by-turn walking directions
- [ ] Mobile-responsive layout
- [ ] Live location tracking (GPS-based "you are here")

---

## 📄 License

MIT © [compiledbyutkarsh](https://github.com/compiledbyutkarsh)
