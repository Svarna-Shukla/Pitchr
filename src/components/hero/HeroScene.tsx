import { Canvas } from "@react-three/fiber";
import HeroMask from "./HeroMask";
import MaskParticles from "./MaskParticles";
import { useIsMobile } from "../../hooks/useIsMobile";
import { isWebGLAvailable } from "../../lib/webgl";

// Plain CSS fallback shown in place of the Canvas when the browser can't create a WebGL context
function NoWebGLFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle, #f9731655, transparent 70%)", boxShadow: "0 0 60px 24px rgba(249,115,22,0.25)" }}
      />
    </div>
  );
}

// Transparent WebGL hero scene: the full low-poly mask + particle sparks, on both desktop and mobile
// (lower dpr on mobile for performance). Dramatic two-light rig — a strong orange uplight, a dim blue
// hemisphere from above. Falls back to a static glow if WebGL itself isn't available.
export default function HeroScene() {
  const isMobile = useIsMobile();
  if (!isWebGLAvailable()) return <NoWebGLFallback />;

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, isMobile ? 1.5 : 2]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <hemisphereLight args={["#3b5bdb", "#050505", 0.25]} />
      <pointLight position={[0, -2.4, 1.8]} color="#f97316" intensity={2.4} distance={8} decay={2} />
      <MaskParticles />
      <HeroMask />
    </Canvas>
  );
}
