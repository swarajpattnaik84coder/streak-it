import { useCallback, useEffect, useState } from "react";
import WorldMap from "../map/WorldMap.jsx";
import MapControls from "../map/MapControls.jsx";
import { SEGMENTS, LEVELS } from "../../data/mockData.js";
import QuestBoard from "../QuestBoard";
import { useProgression } from '../../lib/ProgressionContext';

/**
 * Center column panel housing the fantasy RPG world map and segment navigation.
 */
export default function MapPanel() {
  const { state } = useProgression();
  const currentLevel = state.level;

  // Identify segment containing current level initially
  const initialSeg = SEGMENTS.find(
    (s) => currentLevel >= s.levelRange[0] && currentLevel <= s.levelRange[1]
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
      (s) => currentLevel >= s.levelRange[0] && currentLevel <= s.levelRange[1]
    );
    if (currSeg) {
      setCurrentSegmentId(currSeg.id);
    }
  }, [currentLevel]);

  // Auto-switch to the segment containing the active level when it changes
  useEffect(() => {
    const seg = SEGMENTS.find(
      (s) => currentLevel >= s.levelRange[0] && currentLevel <= s.levelRange[1]
    );
    if (seg) {
      setCurrentSegmentId(seg.id);
    }
  }, [currentLevel]);

  return (
    <div className="flex flex-col shrink-0 min-w-0 bg-rpg-bg">
      {/* World Map interactive surface */}
      <div className="h-[520px] min-h-[520px] shrink-0 relative overflow-hidden">
        <WorldMap
          currentSegmentId={currentSegmentId}
          onSegmentChange={setCurrentSegmentId}
          currentLevel={currentLevel}
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
        currentLevel={currentLevel}
      />

      {/* Today's Writs (Daily Quests) */}
      <QuestBoard />
    </div>
  );
}