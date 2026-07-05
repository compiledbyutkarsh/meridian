import { useEffect, useMemo, useState } from "react";
import { campusGraph } from "./data/campusGraph";
import { findShortestPath } from "./lib/pathfinding";
import { generateDirections } from "./lib/directions";
import { useGeolocation } from "./hooks/useGeolocation";
import { withUserLocation, MY_LOCATION_ID } from "./lib/graphWithLocation";
import { CampusMap } from "./components/CampusMap";
import { IndoorFloorPlan } from "./components/IndoorFloorPlan";
import type { IndoorNode, NodeId } from "./types/graph";
import "./App.css";

function isIndoorNode(node: (typeof campusGraph.nodes)[number]): node is IndoorNode {
  return node.location === "indoor";
}

function App() {
  const [startId, setStartId] = useState<NodeId>(campusGraph.nodes[0].id);
  const [endId, setEndId] = useState<NodeId>(campusGraph.nodes[1].id);
  const [route, setRoute] = useState<{ path: NodeId[]; distance: number } | null>(
    null
  );
  const [view, setView] = useState<"map" | "floorplan">("map");
  const { position, error: locationError, isTracking, start, stop } = useGeolocation();

  const activeGraph = useMemo(() => {
    if (isTracking && position) return withUserLocation(campusGraph, position);
    return campusGraph;
  }, [isTracking, position]);

  useEffect(() => {
    if (isTracking && position && startId !== MY_LOCATION_ID) {
      setStartId(MY_LOCATION_ID);
    }
    if (!isTracking && startId === MY_LOCATION_ID) {
      setStartId(campusGraph.nodes[0].id);
    }
  }, [isTracking, position, startId]);

  const sortedNodes = useMemo(
    () => [...campusGraph.nodes].sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const directions = useMemo(() => {
    if (!route) return [];
    return generateDirections(activeGraph, route.path);
  }, [route, activeGraph]);

  const indoorStopsInRoute = useMemo(() => {
    if (!route) return [];
    return route.path
      .map((id) => activeGraph.nodes.find((n) => n.id === id))
      .filter((n): n is IndoorNode => n !== undefined && isIndoorNode(n));
  }, [route, activeGraph]);

  const indoorBuilding = indoorStopsInRoute[0]?.buildingId ?? null;
  const indoorFloor = indoorStopsInRoute[0]?.floor ?? null;

  const handleFindRoute = () => {
    if (startId === endId) {
      setRoute(null);
      return;
    }
    const result = findShortestPath(activeGraph, startId, endId);
    setRoute(result);

    const hasIndoorStop = result?.path.some((id) => {
      const node = activeGraph.nodes.find((n) => n.id === id);
      return node?.location === "indoor";
    });

    setView(hasIndoorStop ? "floorplan" : "map");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Meridian</h1>
        <p className="tagline">Campus navigation for Amity Noida</p>

        <label>
          From
          <select value={startId} onChange={(e) => setStartId(e.target.value)}>
            {isTracking && position && (
              <option value={MY_LOCATION_ID}>My Location (live)</option>
            )}
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

        {route && directions.length > 0 && (
          <ol className="directions-list">
            {directions.map((step, i) => (
              <li key={i}>
                <span>{step.text}</span>
                {step.distance > 0 && (
                  <small>{Math.round(step.distance)} m</small>
                )}
              </li>
            ))}
          </ol>
        )}

        <button
          className="location-button"
          onClick={isTracking ? stop : start}
        >
          {isTracking ? "Stop Tracking" : "Track My Location"}
        </button>

        {locationError && <p className="hint">{locationError}</p>}

        {indoorBuilding && (
          <div className="view-toggle">
            <button
              className={view === "map" ? "active" : ""}
              onClick={() => setView("map")}
            >
              Map
            </button>
            <button
              className={view === "floorplan" ? "active" : ""}
              onClick={() => setView("floorplan")}
            >
              Floor Plan
            </button>
          </div>
        )}
      </aside>

      <main className="map-area">
        {view === "floorplan" && indoorBuilding && indoorFloor !== null ? (
          <IndoorFloorPlan
            graph={activeGraph}
            buildingId={indoorBuilding}
            floor={indoorFloor}
            path={route?.path ?? []}
            startId={route ? startId : null}
            endId={route ? endId : null}
          />
        ) : (
          <CampusMap
            graph={activeGraph}
            path={route?.path ?? null}
            startId={route ? startId : null}
            endId={route ? endId : null}
            userLocation={position}
          />
        )}
      </main>
    </div>
  );
}

export default App;
