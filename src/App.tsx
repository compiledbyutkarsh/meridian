import { useMemo, useState } from "react";
import { campusGraph } from "./data/campusGraph";
import { findShortestPath } from "./lib/pathfinding";
import { CampusMap } from "./components/CampusMap";
import type { NodeId } from "./types/graph";
import "./App.css";

function App() {
  const [startId, setStartId] = useState<NodeId>(campusGraph.nodes[0].id);
  const [endId, setEndId] = useState<NodeId>(campusGraph.nodes[1].id);
  const [route, setRoute] = useState<{ path: NodeId[]; distance: number } | null>(
    null
  );

  const sortedNodes = useMemo(
    () => [...campusGraph.nodes].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const handleFindRoute = () => {
    if (startId === endId) {
      setRoute(null);
      return;
    }
    const result = findShortestPath(campusGraph, startId, endId);
    setRoute(result);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Meridian</h1>
        <p className="tagline">Campus navigation for Amity Noida</p>

        <label>
          From
          <select value={startId} onChange={(e) => setStartId(e.target.value)}>
            {sortedNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          To
          <select value={endId} onChange={(e) => setEndId(e.target.value)}>
            {sortedNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleFindRoute}>Find Route</button>

        {route && (
          <div className="route-info">
            <strong>{Math.round(route.distance)} m</strong>
            <span>{route.path.length} stops</span>
          </div>
        )}

        {route === null && startId === endId && (
          <p className="hint">Pick two different locations.</p>
        )}
      </aside>

      <main className="map-area">
        <CampusMap
          graph={campusGraph}
          path={route?.path ?? null}
          startId={route ? startId : null}
          endId={route ? endId : null}
        />
      </main>
    </div>
  );
}

export default App;
