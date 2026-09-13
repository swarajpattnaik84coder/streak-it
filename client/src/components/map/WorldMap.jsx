import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { MAP_CONFIG, LEVELS, CURRENT_LEVEL, SEGMENTS } from "../../data/mockData.js";
import MapBackground from "./MapBackground.jsx";
import MapRegion from "./MapRegion.jsx";
import MapSegment from "./MapSegment.jsx";
import ProgressionPath from "./ProgressionPath.jsx";
import LevelNode from "./LevelNode.jsx";
import LevelTooltip from "./LevelTooltip.jsx";

export default function WorldMap({ currentSegmentId, onSegmentChange }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Framer Motion x position value for smooth horizontal panning
  const xX = useMotionValue(0);

  // Update container width on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Compute pan bounds: minX (furthest right), maxX (0 = far left)
  const minX = Math.min(0, containerWidth - MAP_CONFIG.width);
  const maxX = 0;

  // Center pan position on a specific target X coordinate
  const panToX = useCallback((targetX) => {
    const centerOffset = containerWidth / 2;
    const desiredX = centerOffset - targetX;
    const clampedX = Math.max(minX, Math.min(maxX, desiredX));
    animate(xX, clampedX, { type: "spring", stiffness: 180, damping: 24 });
  }, [containerWidth, minX, maxX, xX]);

  // Sync pan when currentSegmentId changes externally
  useEffect(() => {
    const seg = SEGMENTS.find((s) => s.id === currentSegmentId);
    if (seg) {
      panToX(seg.centerPosition);
    }
  }, [currentSegmentId, panToX]);

  // Initial center on current level on mount
  useEffect(() => {
    const currLevel = LEVELS.find((l) => l.id === CURRENT_LEVEL);
    if (currLevel) {
      panToX(currLevel.x);
    }
  }, [panToX]);

  // Handle horizontal mouse wheel panning
  const handleWheel = (e) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const currentX = xX.get();
    const newX = Math.max(minX, Math.min(maxX, currentX - delta * 0.9));
    xX.set(newX);
  };

  // Node click handler
  const handleNodeClick = useCallback((level, e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      setTooltip((prev) =>
        prev?.level?.id === level.id ? null : { level, x: clickX, y: clickY }
      );
    }
  }, []);

  const dismissTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none bg-rpg-bg"
      onWheel={handleWheel}
      onClick={dismissTooltip}
    >
      {/* ── Continuous Horizontal Motion Surface ────────────────────── */}
      <motion.div
        className="h-full"
        style={{ x: xX, width: MAP_CONFIG.width }}
        drag="x"
        dragConstraints={{ left: minX, right: maxX }}
        dragElastic={0.08}
        onDragEnd={() => {
          // Detect which segment center is closest after dragging
          const currentX = xX.get();
          const currentCenterInMap = (containerWidth / 2) - currentX;
          let closestSeg = SEGMENTS[0];
          let minDist = Math.abs(currentCenterInMap - SEGMENTS[0].centerPosition);

          SEGMENTS.forEach((s) => {
            const dist = Math.abs(currentCenterInMap - s.centerPosition);
            if (dist < minDist) {
              minDist = dist;
              closestSeg = s;
            }
          });

          if (closestSeg.id !== currentSegmentId) {
            onSegmentChange(closestSeg.id);
          }
        }}
      >
        <svg
          width={MAP_CONFIG.width}
          height={MAP_CONFIG.height}
          viewBox={`0 0 ${MAP_CONFIG.width} ${MAP_CONFIG.height}`}
          className="w-full h-full block"
        >
          {/* ── Filters & Shared Definitions ────────────────────────── */}
          <defs>
            <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── 1. Cartography Background Layer ─────────────────────── */}
          <MapBackground />

          {/* ── 2. Region Markers Layer ─────────────────────────────── */}
          <MapRegion />

          {/* ── 3. 5-Level Segment Dividers Layer ──────────────────── */}
          <MapSegment />

          {/* ── 4. Progression Paths Layer ──────────────────────────── */}
          {LEVELS.slice(0, -1).map((lvl, i) => {
            const next = LEVELS[i + 1];
            return (
              <ProgressionPath
                key={`path-${lvl.id}`}
                from={lvl}
                to={next}
                completed={next.id <= CURRENT_LEVEL}
              />
            );
          })}

          {/* ── 5. Level Landmark Nodes Layer ──────────────────────── */}
          {LEVELS.map((lvl) => (
            <LevelNode
              key={lvl.id}
              level={lvl}
              onClick={handleNodeClick}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Map Tooltip Overlay ──────────────────────────────────────── */}
      {tooltip && (
        <LevelTooltip
          level={tooltip.level}
          x={tooltip.x}
          y={tooltip.y}
          onClose={() => setTooltip(null)}
        />
      )}
    </div>
  );
}