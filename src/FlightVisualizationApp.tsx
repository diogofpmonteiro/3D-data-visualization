import './App.css';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FlightsScene from './flightsScene/FlightsScene';
import { FlightFilterControls } from './components/FilterControls';
import { Dictionary, IAirport, IFlight } from './types';
import { parseFlightDates, prettyDate } from './Utilities';
import { indexBy } from 'ramda';
import { SimulationSizeControl, SimulationSpeedControl } from './components/SimulationControls';

const date = Date.now();

function FlightVisualizationApp() {
  const [flightsList, setFlightsList] = useState<IFlight[]>([]);
  const [airportsMap, setAirportsMap] = useState<Dictionary<IAirport>>({});
  const [airportsList, setAirportsList] = useState<IAirport[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<IFlight | null>(null);
  const [filteredFlights, setFilteredFlights] = useState<IFlight[]>([]);
  const [maxFlightCount, setMaxFlightCount] = useState(20);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationTime, setSimulationTime] = useState(date);

  useEffect(() => {
    fetch('/data/airports.json')
      .then((e) => e.json())
      .then((airportsData: IAirport[]) => {
        setAirportsList(airportsData);

        const airportsMap = indexBy((e) => e.id, airportsData);
        setAirportsMap(airportsMap);
      });
  }, []);

  useEffect(() => {
    fetch('/data/flights.json')
      .then((e) => e.json())
      .then((flightsData: IFlight[]) => {
        const flights = flightsData.map((eachFlight: any) => parseFlightDates(eachFlight));

        setFlightsList(flights);
      });
  }, []);

  return (
    <div className="App">
      <aside className="controlPanel">
        <div className="input-controls">
          <div>Current date: {prettyDate(new Date(simulationTime))}</div>
          <SimulationSizeControl onMaxFlightCountChange={setMaxFlightCount} />
          <SimulationSpeedControl onSimulationSpeedChange={setSimulationSpeed} />
        </div>
        <hr />
        <FlightFilterControls
          flights={flightsList}
          airports={airportsList}
          airportMap={airportsMap}
          maxFlightCount={maxFlightCount}
          simulationTime={simulationTime}
          selectedFlight={selectedFlight}
          setSelectedFlight={setSelectedFlight}
          onFilteringChanged={setFilteredFlights}
        />
      </aside>
      <React.Suspense fallback={<div>Loading data...ð</div>}>
        <Canvas id="canvas">
          <FlightsScene
            flightsList={filteredFlights}
            airportsList={airportsList}
            airportsMap={airportsMap}
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
            simulationSpeed={simulationSpeed}
            onSimulationMinuteTick={setSimulationTime}
          />
        </Canvas>
      </React.Suspense>
    </div>
  );
}

export default FlightVisualizationApp;
