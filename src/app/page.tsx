"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SceneEditor } from "@/components/SceneEditor"; // Assuming you have this component
import React, { useRef } from "react";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { Icons } from "@/components/icons";

export default function Home(): JSX.Element {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [currentHierarchy, setCurrentHierarchy] = React.useState<string[]>([]);
  const [objectProperties, setObjectProperties] = React.useState<any[]>([]);
  const [showAssetMenu, setShowAssetMenu] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<File | null>(null);
  const [selectedFileBlobURL, setSelectedFileBlobURL] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          setSelectedFile(file);
        };
      reader.readAsArrayBuffer(file);
    }
    };

    const handlePropertiesUpdate = (properties: any[]) => {
      setObjectProperties(properties);
    };

    const handleAddObjectClick = () => {
    setShowAssetMenu(!showAssetMenu);
    };

    const handleAssetSelect = async (assetName: File) => {
      setShowAssetMenu(false);
      const newHierarchy = await getGlbStructure(assetName);
      setCurrentHierarchy(newHierarchy);
      const blobURL = URL.createObjectURL(assetName);
      setSelectedFileBlobURL(blobURL)
      setSelectedAsset(assetName);
    };
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const renderAssetContent = () => {
    if (selectedFile) {
      return (
        <div className="flex flex-col items-start p-2" draggable onDragStart={(e) => { if (e.dataTransfer) { e.dataTransfer.setData('text/plain', selectedFile.name); e.dataTransfer.effectAllowed = 'move' } }}>
            <Icons.file className="w-12 h-12 text-gray-600 mb-2" />
          <div
            className="text-left text-white"
          >
            {selectedFile.name}
          </div>
        </div>
      );
    }
    return <div className="text-gray-500">No assets added yet.</div>;
  };

  const getGlbStructure = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
  
      const url = URL.createObjectURL(file);
  
      loader.load(
        url,
        (gltf) => {
          const structure: string[] = [];
  
          const traverseNode = (node: THREE.Object3D, depth = 0) => {
            structure.push(`${"  ".repeat(depth)}- ${node.name || node.type}`);
            node.children.forEach((child) => traverseNode(child, depth + 1));
          };
  
          traverseNode(gltf.scene);
          resolve(structure);
        },
        undefined,
        (error) => reject(error)
      );
    });
  };
  


  return (
    <div className="h-screen w-screen flex flex-col">
      <PanelGroup direction="vertical" className="flex-grow h-full">
          <Panel className="flex-grow overflow-hidden">
            <PanelGroup direction="horizontal" className="h-full w-full">
              <Panel
                defaultSize={20}
                minSize={10}
                className="border-r border-gray-400 overflow-hidden"
              >
                <div className="p-2 font-bold border-b border-gray-400">
                Hierarchy
                </div>
                <div className="p-2">
                <button onClick={handleAddObjectClick} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded">Add Object</button>
                {currentHierarchy.length > 0 ? (
                      <ul>
                        {currentHierarchy.map((objectName, index) => (
                          <li key={index}>{objectName}</li>
                        ))}
                      </ul>

                  ) : (
                    <div>No assets added to the scene yet. Select an asset using 'Add Object'.</div>
                  )}

                   {/* Asset Menu (conditionally rendered) */}
                  {showAssetMenu && selectedFile === null && (
                        <ul className="bg-gray-200 border border-gray-400 p-2 rounded mt-2">
                              <li className="hover:bg-gray-300 p-1">No assets in Asset Manager. Upload in Assets panel first.</li>
                          </ul>
                      )}
                  
                  

                  {showAssetMenu && selectedFile && (
                    <ul className="bg-gray-200 border border-gray-400 p-2 rounded mt-2"> 
                      <li key={selectedFile.name} className="hover:bg-gray-300 p-1"><button onClick={() => handleAssetSelect(selectedFile)}>{selectedFile.name}</button></li>
                      
                    </ul>
                  )}                
                </div>
              </Panel>
              <PanelResizeHandle className="bg-gray-400" />
              <Panel className="flex-grow overflow-hidden">
                <SceneEditor selectedAsset={selectedFileBlobURL}  onPropertiesUpdate={handlePropertiesUpdate} />
                </Panel>
                
               
                
                 
                
              
                
              

              
            <PanelResizeHandle className="bg-gray-400" />
            <Panel defaultSize={20}
                minSize={10}
                className="border-l border-gray-400"
              >
                <div className="p-2 font-bold border-b border-gray-400">
                  Properties
                </div>
                <div style={{ marginTop: '20px' }}>
                <h3>Object Properties</h3>
                <ul>
                  {objectProperties.map((prop, index) => (
                    <li key={index}>
                      <strong>{prop.key}:</strong> {prop.value}
                    </li>
                  ))}
                </ul>
              </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="bg-gray-400" />        
          <Panel
            minSize={5}
            defaultSize={20}
            className="border-t border-gray-400 overflow-hidden relative"
          >
          <div className="p-2 font-bold border-b border-gray-400 flex items-center justify-between">
            Assets
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
              onClick={() => {
               if (fileInputRef.current) {
                  fileInputRef.current.click();
                }}
              }
            >
              <input type="file" accept=".gltf,.glb" hidden ref={fileInputRef} onChange={handleFileChange} />
              +
            </button>
          </div>          

            <div className="p-2">{renderAssetContent()}</div>
          </Panel>
        </PanelGroup>
         
    </div>
   
  );
}