import { Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { EARTH_SURFACE_HEIGHT } from '../constants';
import { IAirport } from '../types';
import { Box, rotationQuaternionForCoordinates } from '../Utilities';

export default function Airport({ airport }: { airport: IAirport }) {
  const rotationBoxRef = useRef<Group>();
  const [isHovered, setIsHovered] = useState(false);

  if (rotationBoxRef.current) {
    const quaternion = rotationQuaternionForCoordinates(airport.latitude, airport.longitude);
    rotationBoxRef.current.setRotationFromQuaternion(quaternion);
  }

  return (
    // one group for positioning, one for rotation
    <group ref={rotationBoxRef}>
      <group position={[0, EARTH_SURFACE_HEIGHT, 0]}>
        <Box
          onPointerOut={() => setIsHovered(false)}
          onPointerOver={() => setIsHovered(true)}
          size={[0.1, 0.1, 0.1]}
          color={isHovered ? 'hotpink' : 'blue'}
        />

        {isHovered && <pointLight position-y={0.1} intensity={2} color={'white'} />}
        {isHovered && (
          <Html>
            <div className={'info-bubble'}>{airport.city}</div>
          </Html>
        )}
      </group>
    </group>
  );
}
