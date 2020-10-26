import React from "react";
import { useParams } from "react-router-dom";
import ResultsTable from "./ResultsTable";
import { gql, useQuery } from "@apollo/client";
import { format } from "date-fns";

const RACE_INFO_OF = gql`
  query GetRaceInfoOf($raceid: Int!) {
    raceInfoOf(raceid: $raceid) {
      name
      round
      year
      datetime
      drivers {
        driverid
        fullname
        laps
        time
      }
    }
  }
`;

function RaceInfo() {
  const { raceid } = useParams();
  const id = parseInt(raceid);
  const { loading, error, data } = useQuery(RACE_INFO_OF, {
    variables: { raceid: id },
    pollInterval: 500,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  
  const drivers = [...data.raceInfoOf.drivers];
  return (
    <div className="container">
      <h3 className="section-title">
        F1 {`${data.raceInfoOf.name} ${data.raceInfoOf.year}`}
      </h3>
      <p>{format(new Date(parseInt(data.raceInfoOf.datetime)), "M/dd/yyyy h:mm a")}</p>
      <div>
        <ResultsTable raceid={raceid} drivers={drivers} />
      </div>
    </div>
  );
}

export default RaceInfo;
