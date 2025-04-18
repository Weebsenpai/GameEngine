"use client"
import { Canvas, useLoader } from "@react-three/fiber";
import { Grid, OrbitControls, useGLTF } from "@react-three/drei";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Suspense } from "react";
import React from "react";

interface SceneEditorProps {
  selectedAsset: string | null;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ selectedAsset }) => {
  return (
      <div className="h-full w-full">
        
          <Canvas className="h-full w-full" camera={{ position: [5, 5, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Grid
                  position={[0, 0, 0]}
                  infiniteGrid
                  cellSize={0.5}
                  cellThickness={0.6}
                  sectionSize={1}
                  sectionThickness={1.5}
                  sectionColor="#808080"
                  fadeDistance={30}
                  fadeStrength={1}
                  followCamera={false}
                  cellColor="#333333"
              />
              <OrbitControls />
               <Suspense fallback={null}>
                {selectedAsset && (
                  <Model path={selectedAsset} />
                )}
              </Suspense>
             
          </Canvas>
    </div>
  );
};


const Model: React.FC<{ path: string }> = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={0.5} />;
};

export { SceneEditor };