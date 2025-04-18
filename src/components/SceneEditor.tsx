"use client";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Grid,
  OrbitControls,
  useGLTF,
  TransformControls,
} from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface SceneEditorProps {
  selectedAsset: string | null;
  onPropertiesUpdate: (properties: any[]) => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ selectedAsset, onPropertiesUpdate }) => {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const orbitControlsRef = useRef<any>(null);
  
  // Explicitly typing the transformControlMode state to only allow specific values
  const [transformControlMode, setTransformControlMode] = useState<"translate" | "scale" | "rotate">("translate");

  const extractProperties = (obj: any) => {
    if (!obj) return [];

    const properties = [];

    // Add transformation properties
    properties.push(
      { key: 'Position', value: `x: ${obj.position.x}, y: ${obj.position.y}, z: ${obj.position.z}` },
      { key: 'Rotation', value: `x: ${obj.rotation.x}, y: ${obj.rotation.y}, z: ${obj.rotation.z}` },
      { key: 'Scale', value: `x: ${obj.scale.x}, y: ${obj.scale.y}, z: ${obj.scale.z}` }
    );

    // Add material properties (if any material is applied)
    if (obj.material) {
      properties.push(
        { key: 'Material Color', value: obj.material.color ? obj.material.color.getHexString() : 'N/A' },
        { key: 'Material Opacity', value: obj.material.opacity ?? 'N/A' },
        { key: 'Material Wireframe', value: obj.material.wireframe ?? 'N/A' },
        { key: 'Material Reflectivity', value: obj.material.reflectivity ?? 'N/A' },
        { key: 'Material Map', value: obj.material.map ? 'Texture Applied' : 'No Texture' }
      );
    }

    // Add shadow properties (if available)
    properties.push(
      { key: 'Cast Shadows', value: obj.castShadow ? 'Enabled' : 'Disabled' },
      { key: 'Receive Shadows', value: obj.receiveShadow ? 'Enabled' : 'Disabled' }
    );

    return properties;
  };

  const handleObjectClick = (e: any) => {
    const selected = e.object;
    setSelectedObject(selected);
    const properties = extractProperties(selected);
    onPropertiesUpdate(properties);
  };

  const handleTransformChange = () => {
    if (selectedObject) {
      console.log('Updated Position:', selectedObject.position);
      console.log('Updated Rotation:', selectedObject.rotation);
      console.log('Updated Scale:', selectedObject.scale);
      const properties = extractProperties(selectedObject);
      onPropertiesUpdate(properties);
    }
  };

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        setTransformControlMode("scale");
      }
      if (e.key === "r" || e.key === "R") {
        setTransformControlMode("rotate");
      }
      if (e.key === "t" || e.key === "T") {
        setTransformControlMode("translate");
      }
    };

    // Add event listener for window resize
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component is unmounted or re-rendered
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this runs only once after initial render

  const handleBackgroundClick = () => {
    if (!isDragging) {
      setSelectedObject(null);
    }
  };

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        onPointerMissed={handleBackgroundClick}
      >
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

        {/* OrbitControls always enabled unless dragging */}
        <OrbitControls ref={orbitControlsRef} enabled={!isDragging} />

        <Suspense fallback={null}>
          {selectedAsset && (
            <Model
              path={selectedAsset}
              onSelect={(obj) => setSelectedObject(obj)}
            />
          )}
        </Suspense>

        {/* TransformControls only disables orbit during drag */}
        {selectedObject && (
          <TransformControls
            onChange={handleTransformChange}
            object={selectedObject}
            mode={transformControlMode} // Dynamically switch between translate, rotate, and scale
            size={0.8} // adjust size of axes
            onMouseDown={() => {
              setIsDragging(true);
              orbitControlsRef.current.enabled = false;
            }}
            onMouseUp={() => {
              setIsDragging(false);
              orbitControlsRef.current.enabled = true;
            }}
          />
        )}
      </Canvas>
    </div>
  );
};

const Model: React.FC<{
  path: string;
  onSelect: (obj: THREE.Object3D) => void;
}> = ({ path, onSelect }) => {
  const gltf = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);

  return (
    <primitive
      ref={groupRef}
      object={gltf.scene}
      scale={0.5}
      onClick={(e: Event) => {
        e.stopPropagation(); // prevent deselect on click
        if (groupRef.current) {
          onSelect(groupRef.current);
        }
      }}
    />
  );
};

export { SceneEditor };
