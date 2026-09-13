import { Component, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import CharacterModel from "./CharacterModel.jsx";
import CharacterControls from "./CharacterControls.jsx";

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"10px 16px",background:"rgba(10,9,20,0.92)",border:"1px solid #2a253b",borderRadius:8}}>
        <div style={{width:24,height:24,borderRadius:"50%",border:"2px solid #c9a84c",borderTopColor:"transparent",animation:"spin 0.8s linear infinite"}} />
        <span style={{color:"#c9a84c",fontSize:11,fontWeight:600,letterSpacing:2}}>Loading {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

class CharacterErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e) { console.error("3D Character error:", e); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center bg-stone-950/90 border border-rpg rounded-xl">
          <div className="w-9 h-9 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 font-bold">!</div>
          <p className="text-xs font-semibold text-stone-200">Unable to load character</p>
          <p className="text-[10px] text-stone-500">Check public/models/character_ranger.glb</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CharacterViewer({ modelPath = "/models/character_ranger.glb" }) {
  return (
    <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-rpg shadow-2xl"
      style={{ background: "#12101e" }}>
      <CharacterErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 1.1, 3.0], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
          className="w-full h-full"
        >
          {/* Dark navy-charcoal background — NOT pure black */}
          <color attach="background" args={["#12101e"]} />

          {/* ── LIGHTING: Simple, professional, readable ──────────────────── */}

          {/* Strong ambient so dark clothing is visible */}
          <ambientLight intensity={1.1} color="#d8d0c4" />

          {/* KEY LIGHT: warm, from top-front-left */}
          <directionalLight
            position={[1.8, 4.0, 2.5]}
            intensity={2.2}
            color="#fff5e0"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* FILL LIGHT: soft warm-neutral from front-right, no blue tint */}
          <directionalLight
            position={[-2.0, 2.5, 2.0]}
            intensity={0.9}
            color="#e8ddc8"
          />

          {/* FACE LIGHT: focused front-centre to punch through hood shadow */}
          <spotLight
            position={[0.2, 1.7, 1.6]}
            target-position={[0, 1.1, 0]}
            intensity={3.5}
            angle={0.55}
            penumbra={0.6}
            color="#fff8ef"
          />

          {/* RIM LIGHT: gold-amber behind character, separates silhouette */}
          <pointLight position={[0, 2.2, -1.6]} intensity={1.8} color="#d4a030" />

          {/* Subtle warm floor-bounce from pedestal */}
          <pointLight position={[0, 0.1, 0.8]} intensity={0.5} color="#c8a060" />

          {/* ── STAGE ─────────────────────────────────────────────────────── */}
          <mesh position={[0, -0.01, 0]} receiveShadow>
            <cylinderGeometry args={[1.0, 1.1, 0.04, 32]} />
            <meshStandardMaterial color="#16142a" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Gold ring on pedestal */}
          <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.94, 1.0, 32]} />
            <meshBasicMaterial color="#c9a84c" opacity={0.55} transparent />
          </mesh>

          {/* ── CHARACTER ─────────────────────────────────────────────────── */}
          <Suspense fallback={<CanvasLoader />}>
            <CharacterModel modelPath={modelPath} />
          </Suspense>

          {/* ── CONTROLS ──────────────────────────────────────────────────── */}
          <CharacterControls />
        </Canvas>
      </CharacterErrorBoundary>
    </div>
  );
}