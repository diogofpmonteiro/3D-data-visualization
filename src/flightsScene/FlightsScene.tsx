import { OrbitControls } from '@react-three/drei';
import { indexBy } from 'ramda';
// import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { PointLight } from 'three';
import Globe from '../models/Globe';
import { IAirport, IFlight } from '../types';
import { parseFlightDates } from '../Utilities';
import Airport from './Airport';
import Flight from './Flight';

export default function FlightsScene() {
  const [airportsList, setAirportsList] = useState<IAirport[]>([]);
  const [airportsMap, setAirportsMap] = useState<{ [key: string]: IAirport }>({});
  const [flightsList, setFlightsList] = useState<IFlight[]>([]);

  useEffect(() => {
    // ! Attempt at using async await instead of then catch
    // const getAirportsData = async () => {
    //   const response = await fetch('./data/airports.json');
    //   const <airportsData: IAirport[]> = response.json();
    //   setAirportsList(await airportsData);

    //   const airportsMap = indexBy(elem => { elem.id, airportsData })
    //   setAirportsMap(airportsMap)
    // };
    // getAirportsData();

    fetch('/data/airports.json')
      .then((e) => e.json())
      .then((airportsData: IAirport[]) => {
        setAirportsList(airportsData);

        const airportsMap = indexBy((e) => e.id, airportsData);
        setAirportsMap(airportsMap);
      });
  }, []);

  useEffect(() => {
    // ! Attempt at using async await instead of then catch
    //   const getFlightsData = async () => {
    //     const response = await fetch('./data/flights.json');
    //     const flightsData = response.json();
    //     const flights = flightsData.map((eachFlight: any) => parseFlightDates(eachFlight));
    //     setFlightsList(await flightsData);
    //   };
    //   getFlightsData();

    fetch('/data/flights.json')
      .then((e) => e.json())
      .then((flightsData: IFlight[]) => {
        const flights = flightsData.map((eachFlight: any) => parseFlightDates(eachFlight));

        setFlightsList(flights);
      });
  }, []);

  const lightRef = useRef<PointLight>();

  const sydney = airportsList.find((oneAirport) => oneAirport.id === 'SYD');
  const budapest = airportsList.find((oneAirport) => oneAirport.id === 'BUD');

  //   useFrame((state, delta) => {
  //     const phase = (state.clock.elapsedTime % 3) / 3;
  //     const phaseRadians = Math.PI * 2 * phase;

  //     if (lightRef.current) {
  //       // there are actual [x,y,z] coordinates, hence the variable naming
  //       const x = Math.sin(phaseRadians) * 10;
  //       const z = Math.cos(phaseRadians) * 10;
  //       lightRef.current.position.set(x, 0, z);
  //     }
  //   });

  const flights = flightsList.slice(0, 10);

  return (
    <>
      <OrbitControls />
      <pointLight ref={lightRef} intensity={2} position={[2, 2, 2]} />
      <Globe />

      {flights.map((flight: IFlight) => {
        if (airportsList.length > 0) {
          const to = airportsMap[flight.arrivalAirportId];
          const from = airportsMap[flight.departureAirportId];

          return <Flight key={flight.id} from={from} to={to} />;
        } else {
          return null;
        }
      })}

      {airportsList.map((eachAirport) => {
        return <Airport key={eachAirport.id} airport={eachAirport} />;
      })}

      {sydney && budapest && <Flight from={sydney!} to={budapest!} />}
      {budapest && budapest && <Flight from={budapest!} to={sydney!} />}
    </>
  );
}
