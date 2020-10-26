import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";

const F1RACES = gql`
  query races {
    races {
      raceid
      name
      round
      year
      datetime
    }
  }
`;

function RaceList() {
  const { loading, error, data } = useQuery(F1RACES, {
    pollInterval: 500,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  
  return (
    <div className="container">
      <h3 className="section-title">F1 Races</h3>
      <ul className="f1races">
        {data.races &&
          data.races.map((race) => (
            <Link key={race.raceid} to={`/race/${race.raceid}`}>
              <li>
                <div>
                  {format(new Date(parseInt(race.datetime)), "M/dd/yyyy")}
                </div>
                <div className="time">
                  {format(new Date(parseInt(race.datetime)), "h:mm a")}
                </div>                
                <div>{race.name}</div>
                <div>Round {race.round}</div>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}

export default RaceList;
