import { EARTH_SURFACE_HEIGHT, FLOAT_HEIGHT } from '../constants';
import Plane from '../models/Plane';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Quaternion, Vector3 } from 'three';
import { IAirport } from '../types';
import { getRotationForDirection, rotationQuaternionForCoordinates } from '../Utilities';

export default function Flight({ from, to }: { from: IAirport; to: IAirport }) {
  const rotationBoxRef = useRef<Group>();
  const flightContainerRef = useRef<Group>();

  const fromQuaternion = rotationQuaternionForCoordinates(from.latitude, from.longitude);
  const toQuaternion = rotationQuaternionForCoordinates(to.latitude, to.longitude);

  // a way for our plane to give a full lap around the globe using quaternions
  //   useFrame((state, delta) => {
  //     const phase = (state.clock.elapsedTime % 4) / 4;

  //     if (rotationGroup.current) {
  //       const quaternion = new Quaternion();
  //       quaternion.setFromAxisAngle(LEFT, phase * Math.PI * 2);

  //       rotationGroup.current.setRotationFromQuaternion(quaternion);
  //       //   rotationGroup.current.rotateOnAxis(LEFT, 0.1);
  //     }
  //   });

  useFrame((state, delta) => {
    const phase = (state.clock.elapsedTime % 5) / 5;

    if (flightContainerRef.current && rotationBoxRef.current) {
      const quaternion = new Quaternion();
      quaternion.slerpQuaternions(fromQuaternion, toQuaternion, phase);

      const worldPositionBefore = new Vector3();
      flightContainerRef.current.getWorldPosition(worldPositionBefore);

      rotationBoxRef.current.setRotationFromQuaternion(quaternion);

      flightContainerRef.current.lookAt(worldPositionBefore);
      flightContainerRef.current.rotation.z = getRotationForDirection(from, to);
    }
  });

  return (
    <group ref={rotationBoxRef}>
      <group ref={flightContainerRef} position-y={EARTH_SURFACE_HEIGHT + FLOAT_HEIGHT}>
        <Plane />
      </group>
    </group>
  );
}
