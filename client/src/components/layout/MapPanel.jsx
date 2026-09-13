import { useCallback, useState } from "react";
import WorldMap from "../map/WorldMap.jsx";
import MapControls from "../map/MapControls.jsx";
import { SEGMENTS, CURRENT_LEVEL, LEVELS } from "../../data/mockData.js";

/**
 * Center column panel housing the fantasy RPG world map and segment navigation.
 */
export default function MapPanel() {
  // Identify segment containing current level initially
  const initialSeg = SEGMENTS.find(
    (s) => CURRENT_LEVEL >= s.levelRange[0] && CURRENT_LEVEL <= s.levelRange[1]
  ) || SEGMENTS[0];

  const [currentSegmentId, setCurrentSegmentId] = useState(initialSeg.id);

  const handlePrevSegment = useCallback(() => {
    setCurrentSegmentId((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextSegment = useCallback(() => {
    setCurrentSegmentId((prev) => Math.min(SEGMENTS.length, prev + 1));
  }, []);

  const handleCenterOnCurrent = useCallback(() => {
    const currSeg = SEGMENTS.find(
      (s) => CURRENT_LEVEL >= s.levelRange[0] && CURRENT_LEVEL <= s.levelRange[1]
    );
    if (currSeg) {
      setCurrentSegmentId(currSeg.id);
    }
  }, []);

  return (
    <main className="flex flex-col flex-1 min-w-0 overflow-hidden bg-rpg-bg">
      {/* World Map interactive surface */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <WorldMap
          currentSegmentId={currentSegmentId}
          onSegmentChange={setCurrentSegmentId}
        />
      </div>

      {/* Map Segment Navigation Controls */}
      <MapControls
        currentSegmentId={currentSegmentId}
        totalSegments={SEGMENTS.length}
        onSelectSegment={setCurrentSegmentId}
        onPrevSegment={handlePrevSegment}
        onNextSegment={handleNextSegment}
        onCenterOnCurrent={handleCenterOnCurrent}
      />
    </main>
  );
}