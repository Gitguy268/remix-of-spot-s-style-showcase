import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html, useProgress, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { RotateCcw, Box, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ParticleBackground from "@/components/ParticleBackground";
import ErrorBoundary from "@/components/ErrorBoundary";
import spotTeeProduct from "@/assets/spot-tee-product.png";

// Loading component
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
};

// GLB Model component
const GLBModel = ({ url, isRotating }: { url: string; isRotating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  
  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += 0.005;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  const clonedScene = scene.clone();
  
  const box = new THREE.Box3().setFromObject(clonedScene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;
  
  clonedScene.position.sub(center);
  clonedScene.scale.setScalar(scale);

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Animated dog model placeholder
const SpotModel = ({ isRotating }: { isRotating: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += 0.005;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={1.2}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.95, 0.7, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.12, 0.2, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[1.1, 0.68, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.9, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2cbbc3" emissive="#2cbbc3" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.8, 0.9, -0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2cbbc3" emissive="#2cbbc3" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5, 1.1, 0.25]} rotation={[0.3, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 1.1, -0.25]} rotation={[-0.3, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      {[[-0.3, 0, 0.25], [-0.3, 0, -0.25], [0.3, 0, 0.25], [0.3, 0, -0.25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[-0.7, 0.6, 0]} rotation={[0, 0, 0.8]} castShadow>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      <mesh position={[0.45, 0.65, 0]} rotation={[0, 0, 1.57]}>
        <torusGeometry args={[0.22, 0.03, 8, 24]} />
        <meshStandardMaterial color="#2cbbc3" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
};

interface ModelConfig {
  id: string;
  name: string;
  type: "placeholder" | "glb";
  url?: string;
}

const defaultModels: ModelConfig[] = [
  { id: "spot", name: "Spot", type: "glb", url: "/models/spot-model.glb" },
  { id: "spot2", name: "Spot Alt", type: "glb", url: "/models/spot-model-2.glb" },
  { id: "tshirt", name: "Spot Tee", type: "glb", url: "/models/spot-tshirt.glb" },
  { id: "hoodie", name: "Spot Hoodie", type: "glb", url: "/models/spot-hoodie.glb" },
];

const Spot3DViewer = () => {
  const [activeModel, setActiveModel] = useState("spot");
  const [isRotating, setIsRotating] = useState(true);
  const [hasError, setHasError] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  const activeModelConfig = defaultModels.find(m => m.id === activeModel);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.getDistance();
      controlsRef.current.dollyTo(Math.max(currentDistance - 1, 2), true);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.getDistance();
      controlsRef.current.dollyTo(Math.min(currentDistance + 1, 6), true);
    }
  }, []);

  // Static fallback if 3D fails
  if (hasError) {
    return (
      <section className="py-24 relative">
        <ParticleBackground />
        <div className="section-container relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Spot in <span className="text-gradient">3D</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Explore our products from every angle.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale-in" delay={200}>
            <div className="max-w-2xl mx-auto">
              <img 
                src={spotTeeProduct} 
                alt="Spot Tee product showcase" 
                className="w-full rounded-2xl shadow-xl"
              />
              <p className="text-center text-sm text-muted-foreground mt-4">
                3D viewer unavailable. Showing product image instead.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative" aria-labelledby="3d-viewer-heading">
      <ParticleBackground />
      <div className="section-container relative z-10">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 id="3d-viewer-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Meet Spot in <span className="text-gradient">3D</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore our products from every angle. Drag to rotate, scroll to zoom.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="scale-in" delay={200}>
          <div className="relative max-w-4xl mx-auto">
            {/* 3D Canvas */}
            <div className="aspect-square md:aspect-video rounded-2xl overflow-hidden glow-border bg-card relative">
              <ErrorBoundary
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center p-8">
                      <img 
                        src={spotTeeProduct} 
                        alt="Spot Tee Product" 
                        className="w-full max-w-md mx-auto mb-4 rounded-lg"
                      />
                      <p className="text-muted-foreground text-sm">
                        3D viewer unavailable. Showing product image instead.
                      </p>
                    </div>
                  </div>
                }
                onError={(error) => {
                  console.error('3D Viewer Error:', error);
                  setHasError(true);
                }}
              >
                <Canvas
                  camera={{ position: [3, 2, 3], fov: 45 }}
                  shadows
                  dpr={[1, 2]}
                  onError={() => setHasError(true)}
                >
                <Suspense fallback={<Loader />}>
                  <ambientLight intensity={0.4} />
                  <spotLight 
                    position={[5, 5, 5]} 
                    angle={0.3} 
                    penumbra={1} 
                    intensity={1}
                    castShadow
                    shadow-mapSize={1024}
                  />
                  <spotLight 
                    position={[-5, 5, -5]} 
                    angle={0.3} 
                    penumbra={1} 
                    intensity={0.5}
                  />
                  
                  {activeModelConfig?.type === "glb" && activeModelConfig.url ? (
                    <GLBModel url={activeModelConfig.url} isRotating={isRotating} />
                  ) : (
                    <SpotModel isRotating={isRotating} />
                  )}
                  
                  <ContactShadows 
                    position={[0, -1, 0]} 
                    opacity={0.4} 
                    scale={5} 
                    blur={2.5} 
                  />
                  
                  <OrbitControls 
                    ref={controlsRef}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={6}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Suspense>
              </Canvas>
              </ErrorBoundary>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRotating(!isRotating)}
                className="bg-background/80 backdrop-blur-sm"
                aria-label={isRotating ? "Stop auto-rotation" : "Start auto-rotation"}
              >
                <RotateCcw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="bg-background/80 backdrop-blur-sm"
                aria-label="Reset view"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Model selector */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {defaultModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setActiveModel(model.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    activeModel === model.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  <Box className="w-4 h-4" />
                  {model.name}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Click and drag to rotate • Scroll to zoom • Use controls for precision
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Spot3DViewer;