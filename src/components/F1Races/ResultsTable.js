import React from "react";
import ResultsRow from "./ResultsRow";

function ResultsTable({ raceid, drivers }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Driver</th>
          <th>Laps</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((driver) => (
          <ResultsRow key={driver.driverid} raceid={raceid} driver={driver} />
        ))}
      </tbody>
    </table>
  );
}

export default ResultsTable;
