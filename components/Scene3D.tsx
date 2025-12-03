// @ts-nocheck
import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, createPortal } from '@react-three/fiber';
import { OrbitControls, Float, Environment, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Product } from '../types';

const MODEL_URL = "https://raw.githubusercontent.com/ayoubazizi-droid/perfume-store-3d-models/main/pbfwedjlwebsitev2.glb";
const HDRI_URL = "https://raw.githubusercontent.com/ayoubazizi-droid/perfume-store-3d-models/main/citrus_orchard_road_puresky_4k.hdr";

// Error Boundary to handle HDRI loading failures gracefully
class EnvironmentBoundary extends React.Component<{ files: string }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) {
      return <Environment preset="city" blur={0.8} />;
    }
    return <Environment files={this.props.files} blur={0.8} background={false} />;
  }
}

const PerfumeModel = ({ product }: { product: Product }) => {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  
  // Clone the scene so we can modify it without affecting the cached original
  const clone = useMemo(() => scene.clone(), [scene]);
  
  // Store lists of meshes for each material type
  const [meshes, setMeshes] = useState<{ 
    glass: THREE.Mesh[]; 
    metal: THREE.Mesh[]; 
    plastic: THREE.Mesh[]; 
    liquid: THREE.Mesh[] 
  }>({
    glass: [],
    metal: [],
    plastic: [],
    liquid: []
  });

  useLayoutEffect(() => {
    const foundGlass: THREE.Mesh[] = [];
    const foundMetal: THREE.Mesh[] = [];
    const foundPlastic: THREE.Mesh[] = [];
    const foundLiquid: THREE.Mesh[] = [];

    console.log("Traversing optimized model scene...");

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        
        // Prevent culling issues
        mesh.frustumCulled = false;
        
        // 1. Target Glass Parts
        if (
             name.includes('bottel_glass_mettal') || 
             name.includes('bottel_cap_glass_matterial') ||
             name.includes('bottle_glass')
        ) {
            console.log(`Assigning GLASS material to: ${mesh.name}`);
            foundGlass.push(mesh);
        }
        // 2. Target Liquid
        else if (
            name.includes('liquid') || 
            name.includes('water') || 
            name.includes('juice')
        ) {
            console.log(`Assigning LIQUID material to: ${mesh.name}`);
            foundLiquid.push(mesh);
        }
        // 3. Target Plastic Tube / Internal Parts
        else if (
            name.includes('tube') || 
            name.includes('plastic') || 
            name.includes('pipe')
        ) {
            console.log(`Assigning PLASTIC material to: ${mesh.name}`);
            foundPlastic.push(mesh);
        }
        // 4. Fallback for Metal Parts
        else if (name.includes('metal') || name.includes('gold') || name.includes('silver')) {
            console.log(`Assigning METAL material to: ${mesh.name}`);
            foundMetal.push(mesh);
        }
      }
    });

    setMeshes({ glass: foundGlass, metal: foundMetal, plastic: foundPlastic, liquid: foundLiquid });
  }, [clone]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating/breathing animation
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <group scale={2.5}>
            {/* Render the entire scene hierarchy. This preserves all positions and transforms. */}
            <primitive object={clone} />

            {/* Apply Glass Material to identified meshes */}
            {meshes.glass.map((mesh, index) => (
                createPortal(
                    <meshPhysicalMaterial 
                        key={`glass-${index}`}
                        transparent={true}
                        transmission={1} 
                        roughness={0} 
                        metalness={0}
                        reflectivity={1} 
                        thickness={0.1} // Reduced thickness for realistic glass
                        ior={1.5} 
                        clearcoat={1}
                        clearcoatRoughness={0}
                        envMapIntensity={3}
                        color="#ffffff"
                        side={THREE.DoubleSide}
                        depthWrite={false} // Helps with sorting transparent objects
                    />,
                    mesh
                )
            ))}

            {/* Apply Liquid Material - Same as glass but with specific color */}
            {meshes.liquid.map((mesh, index) => (
                createPortal(
                    <meshPhysicalMaterial 
                        key={`liquid-${index}`}
                        transparent={true}
                        transmission={1} // High transmission like the bottle
                        roughness={0} 
                        metalness={0}
                        reflectivity={1} 
                        thickness={0.1}
                        ior={1.33} // Slightly different IOR for liquid
                        clearcoat={1}
                        clearcoatRoughness={0}
                        envMapIntensity={3}
                        color="#FFD3B0" // The requested color
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />,
                    mesh
                )
            ))}

             {/* Apply Plastic/Tube Material (20% less transparent) */}
             {meshes.plastic.map((mesh, index) => (
                createPortal(
                    <meshPhysicalMaterial 
                        key={`plastic-${index}`}
                        transparent={true}
                        transmission={0.8} // 20% less transparent than the bottle (1.0)
                        roughness={0}      // Same smoothness
                        metalness={0}
                        reflectivity={1}
                        thickness={0.1}
                        ior={1.5}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        envMapIntensity={3}
                        color="#ffffff"
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />,
                    mesh
                )
            ))}

            {/* Apply Metal Material to identified meshes */}
            {meshes.metal.map((mesh, index) => (
                createPortal(
                    <meshStandardMaterial 
                        key={`metal-${index}`}
                        color="#f1f5f9" 
                        metalness={1} 
                        roughness={0.1} 
                        envMapIntensity={2.0}
                    />,
                    mesh
                )
            ))}
        </group>
      </Center>
    </group>
  );
};

interface Scene3DProps {
  product: Product;
}

export const Scene3D: React.FC<Scene3DProps> = ({ product }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden relative shadow-2xl shadow-rose-900/10">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 3.5], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={5} color={product.color} />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <PerfumeModel product={product} />
        </Float>

        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        <EnvironmentBoundary files={HDRI_URL} />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 text-xs text-rose-200/50 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 pointer-events-none">
        Wait for HDRI...
      </div>
    </div>
  );
};