import React, { useState } from "react";
import { format } from "date-fns";
import { gql, useMutation } from "@apollo/client";

const CREATE_RACE = gql`
  mutation CreateRace($input: RaceInput!) {
    createRace(input: $input) {
      raceid
      name
    }
  }
`;

function StepSave({ info }) {
  const [confirmed, setConfirmed] = useState(false);
  const [createF1Race, { loading, error }] = useMutation(CREATE_RACE);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (!confirmed) {
    setConfirmed(true); 
    const year = parseInt(format(new Date(info.datetime), "yyyy"));
    const input = {
      name: info.name,
      round: parseInt(info.round), 
      datetime: new Date(info.datetime),
      driveridlist: info.driveridlist,
      year,
    };
    createF1Race({ variables: { input } });
  }

  return (
    <div>
      <h3 className="section-title">Confirmed</h3>
      <div>
        <ul>
          <li>{`${info.name} – Round ${info.round}`}</li>
          <li>{format(info.datetime, "M/dd/yyyy h:mm a")}</li>
        </ul>
        <ul>
          {info.participants.map((driver) => (
            <li key={driver.driverid}>{driver.fullname}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StepSave;
