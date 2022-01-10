import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { PLANE_ROOT_NODE_POSITION, PLANE_ROOT_NODE_ROTATION, PLANE_SCALE } from '../constants';

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_1: THREE.Mesh;
    mesh_2: THREE.Mesh;
    mesh_3: THREE.Mesh;
  };
  materials: {
    color_10988977: THREE.MeshStandardMaterial;
    color_15277357: THREE.MeshStandardMaterial;
    color_16448250: THREE.MeshStandardMaterial;
    color_2829873: THREE.MeshStandardMaterial;
  };
};

const PATH_TO_MODEL = '/models/plane/plane.gltf';

const hotPinkMaterial = new THREE.MeshStandardMaterial({
  emissive: 'hotpink',
  emissiveIntensity: 2.0,
});

export default function Plane({ ...props }: JSX.IntrinsicElements['group'] & { selected: boolean }) {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(PATH_TO_MODEL) as GLTFResult;
  return (
    <group scale={PLANE_SCALE} ref={group} {...props} dispose={null}>
      <group
        position={PLANE_ROOT_NODE_POSITION}
        rotation={PLANE_ROOT_NODE_ROTATION}
        name="tinkerobjcleanermaterialmergergles"
        userData={{ name: 'tinker.obj.cleaner.materialmerger.gles' }}
      >
        <mesh
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={props.selected ? hotPinkMaterial : materials.color_10988977}
        />
        <mesh name="mesh_1" geometry={nodes.mesh_1.geometry} material={materials.color_15277357} />
        <mesh name="mesh_2" geometry={nodes.mesh_2.geometry} material={materials.color_16448250} />
        <mesh name="mesh_3" geometry={nodes.mesh_3.geometry} material={materials.color_2829873} />
      </group>
    </group>
  );
}

useGLTF.preload(PATH_TO_MODEL);
