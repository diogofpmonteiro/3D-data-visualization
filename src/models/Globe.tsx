import * as THREE from 'three';
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { GLOBE_SCALE } from '../constants';

type GLTFResult = GLTF & {
  nodes: {
    Earth_Surfacemat_0: THREE.Mesh;
  };
  materials: {
    ['Surface.mat']: THREE.MeshStandardMaterial;
  };
};
const PATH_TO_MODEL = '/models/globe/globe.gltf';

export default function Globe({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(PATH_TO_MODEL) as GLTFResult;
  return (
    <group ref={group} {...props} scale={GLOBE_SCALE} dispose={null}>
      <mesh
        name="Earth_Surfacemat_0"
        geometry={nodes.Earth_Surfacemat_0.geometry}
        material={materials['Surface.mat']}
        userData={{ name: 'Earth_Surface.mat_0' }}
      />
    </group>
  );
}

useGLTF.preload(PATH_TO_MODEL);
