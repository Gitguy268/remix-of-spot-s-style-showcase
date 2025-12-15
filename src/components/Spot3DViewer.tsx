import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, useProgress, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { RotateCcw, Box, Upload, X } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

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

  // Clone the scene to avoid issues with reusing
  const clonedScene = scene.clone();
  
  // Auto-center and scale the model
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

// Animated dog model placeholder (geometric representation)
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
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.6, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0.95, 0.7, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.12, 0.2, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[1.1, 0.68, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.8, 0.9, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2cbbc3" emissive="#2cbbc3" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.8, 0.9, -0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2cbbc3" emissive="#2cbbc3" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[0.5, 1.1, 0.25]} rotation={[0.3, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 1.1, -0.25]} rotation={[-0.3, 0, 0.5]} castShadow>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      
      {/* Legs */}
      {[[-0.3, 0, 0.25], [-0.3, 0, -0.25], [0.3, 0, 0.25], [0.3, 0, -0.25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
      ))}
      
      {/* Tail */}
      <mesh position={[-0.7, 0.6, 0]} rotation={[0, 0, 0.8]} castShadow>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      
      {/* Collar with teal accent */}
      <mesh position={[0.45, 0.65, 0]} rotation={[0, 0, 1.57]}>
        <torusGeometry args={[0.22, 0.03, 8, 24]} />
        <meshStandardMaterial color="#2cbbc3" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
};

// T-Shirt model placeholder
const TShirtModel = ({ isRotating }: { isRotating: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += 0.005;
    }
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <group ref={meshRef as any} position={[0, -0.3, 0]}>
      {/* T-shirt body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.4, 0.3]} />
        <meshStandardMaterial color="#f5f4eb" roughness={0.8} />
      </mesh>
      
      {/* Sleeves */}
      <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.25]} />
        <meshStandardMaterial color="#f5f4eb" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.25]} />
        <meshStandardMaterial color="#f5f4eb" roughness={0.8} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 0.7, 0.1]}>
        <torusGeometry args={[0.2, 0.05, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#e8e8e0" roughness={0.8} />
      </mesh>
      
      {/* Spot logo (simplified) */}
      <mesh position={[0.25, 0.2, 0.16]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

// Hoodie model placeholder
const HoodieModel = ({ isRotating }: { isRotating: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += 0.005;
    }
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <group ref={meshRef as any} position={[0, -0.3, 0]}>
      {/* Hoodie body */}
      <mesh castShadow>
        <boxGeometry args={[1.3, 1.5, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Hood */}
      <mesh position={[0, 0.9, -0.1]} castShadow>
        <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Sleeves */}
      <mesh position={[-0.85, 0.2, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.6, 0.45, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0.85, 0.2, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.6, 0.45, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Pocket */}
      <mesh position={[0, -0.3, 0.18]}>
        <boxGeometry args={[0.7, 0.3, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      
      {/* Spot logo */}
      <mesh position={[0, 0.3, 0.18]}>
        <circleGeometry args={[0.18, 16]} />
        <meshStandardMaterial color="#2cbbc3" />
      </mesh>
    </group>
  );
};

interface ModelConfig {
  id: string;
  name: string;
  type: "placeholder" | "glb";
  component?: React.ComponentType<{ isRotating: boolean }>;
  url?: string;
}

const defaultModels: ModelConfig[] = [
  { id: "spot", name: "Spot", type: "glb", url: "/models/spot-model.glb" },
  { id: "tshirt", name: "Spot TEE", type: "placeholder", component: TShirtModel },
  { id: "hoodie", name: "Spot Hoodie", type: "placeholder", component: HoodieModel },
];

const Spot3DViewer = () => {
  const [models, setModels] = useState<ModelConfig[]>(defaultModels);
  const [activeModel, setActiveModel] = useState("spot");
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  const activeModelConfig = models.find(m => m.id === activeModel);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const modelFile = files.find(f => 
      f.name.endsWith('.glb') || f.name.endsWith('.gltf') || f.name.endsWith('.usdz')
    );

    if (modelFile) {
      const url = URL.createObjectURL(modelFile);
      const fileName = modelFile.name.replace(/\.(glb|gltf|usdz)$/, '');
      const newModelId = `custom-${Date.now()}`;
      
      setModels(prev => [
        ...prev,
        { id: newModelId, name: fileName, type: "glb", url }
      ]);
      setActiveModel(newModelId);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const modelFile = Array.from(files).find(f => 
      f.name.endsWith('.glb') || f.name.endsWith('.gltf') || f.name.endsWith('.usdz')
    );

    if (modelFile) {
      const url = URL.createObjectURL(modelFile);
      const fileName = modelFile.name.replace(/\.(glb|gltf|usdz)$/, '');
      const newModelId = `custom-${Date.now()}`;
      
      setModels(prev => [
        ...prev,
        { id: newModelId, name: fileName, type: "glb", url }
      ]);
      setActiveModel(newModelId);
    }
  }, []);

  const removeCustomModel = useCallback((modelId: string) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
    if (activeModel === modelId) {
      setActiveModel("spot");
    }
  }, [activeModel]);

  return (
    <section className="py-24 bg-gradient-to-b from-card to-background">
      <div className="section-container">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Spot in <span className="text-gradient">3D</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore our products from every angle. Drag to rotate, scroll to zoom.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="scale-in" delay={200}>
          <div className="relative max-w-4xl mx-auto">
            {/* 3D Canvas with drag-drop zone */}
            <div 
              className={`aspect-square md:aspect-video rounded-2xl overflow-hidden glow-border bg-card relative transition-all duration-200 ${
                isDragging ? "ring-4 ring-primary ring-opacity-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drag overlay */}
              {isDragging && (
                <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-xl font-semibold">Drop your GLB/USDZ file here</p>
                    <p className="text-muted-foreground">Supports .glb, .gltf, and .usdz formats</p>
                  </div>
                </div>
              )}

              <Canvas
                camera={{ position: [3, 2, 3], fov: 45 }}
                shadows
                dpr={[1, 2]}
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
                  ) : activeModelConfig?.component ? (
                    <activeModelConfig.component isRotating={isRotating} />
                  ) : (
                    <SpotModel isRotating={isRotating} />
                  )}
                  
                  <ContactShadows 
                    position={[0, -1, 0]} 
                    opacity={0.4} 
                    scale={5} 
                    blur={2.5} 
                  />
                  
                  <Environment preset="studio" />
                  
                  <OrbitControls 
                    enablePan={false}
                    minDistance={2}
                    maxDistance={6}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".glb,.gltf,.usdz"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 backdrop-blur-sm pointer-events-none"
                  aria-label="Upload 3D model"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                </Button>
              </label>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRotating(!isRotating)}
                className="bg-background/80 backdrop-blur-sm"
                aria-label={isRotating ? "Stop rotation" : "Start rotation"}
              >
                <RotateCcw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </Button>
            </div>

            {/* Model selector */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setActiveModel(model.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeModel === model.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  <Box className="w-4 h-4" />
                  {model.name}
                  {model.id.startsWith("custom-") && (
                    <X 
                      className="w-3 h-3 ml-1 hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomModel(model.id);
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Drag and drop GLB/USDZ files onto the viewer or click the upload button.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Spot3DViewer;
