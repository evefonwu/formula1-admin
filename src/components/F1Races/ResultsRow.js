import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ImPencil, ImCancelCircle, ImCheckmark } from "react-icons/im";
import { IconContext } from "react-icons";

const UPDATE_RESULT = gql`
  mutation UpdateRaceResultFor(
    $raceid: Int!
    $driverid: Int!
    $input: ResultInput!
  ) {
    updateRaceResultFor(raceid: $raceid, driverid: $driverid, input: $input) {
      resultid
      raceid
      driverid
      laps
      time
    }
  }
`;

const init = {
  laps: "",
  time: "",
};
function ResultsRow({ raceid, driver }) {
  const [message, setMessage] = useState({});
  const [form, setForm] = useState(init);
  const [isEditing, setIsEditing] = useState(false);
  const [updateResult] = useMutation(UPDATE_RESULT);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setForm({
      laps: driver.laps || "",
      time: driver.time || "",
    });    
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEnableButton) return;

    const raceidInt = parseInt(raceid);
    const driverid = driver.driverid;
    const input = {
      laps: parseInt(form.laps),
      time: form.time,
    };
    const vbl = { raceid: raceidInt, driverid, input };
    updateResult({ variables: vbl });
    setIsEditing(false);
  };
  
  const handleChange = (event) => {    
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    let message = {}
    if (event.target.name === "laps") {
      if (!validLaps(event.target.value)) {
        message.laps = "invalid laps";
      } else {
        message.laps = null;
      }
    } 
    if (event.target.name === "time") {
      if (!validTime(event.target.value)) {
        message.time = "invalid time";
      } else {
        message.time = null;
      }
    }
    setMessage(message)
  };

  const validTime = (time) => {
    if (typeof time !== "string") return false;
    return time && time.trim().length > 1;
  };

  const validLaps = (laps) => {
    if (!laps) return false;
    const intLaps = parseInt(laps);
    if (isNaN(intLaps)) return false;
    return intLaps > -1;
  };

  let isEnableButton = (validLaps(form.laps) && validTime(form.time));

  return (
    <tr>
      <td>{driver && driver.fullname}</td>
      {isEditing ? (
        <>
          <td>
            <input
              type="number"
              min={0}
              max={100}
              name="laps"
              value={form.laps}
              onChange={handleChange}
              placeholder="58"
              data-message={message.laps ? "error" : ""}
            />
          </td>
          <td>
            <input
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="eg 1:36:27.356"
              data-message={message.time ? "error" : ""}
            />
          </td>
        </>
      ) : (
        <>
          <td>{driver && driver.laps}</td>
          <td>{driver && driver.time}</td>
        </>
      )}
      <td>
        {isEditing ? (
          <div className="edit-action-panel">
            <IconContext.Provider
              value={{
                size: "1.1em",
                color: "#4CAF50",
              }}
            >
              <span
                onClick={handleUpdate}
                className={isEnableButton ? "checkmark" : "no-cursor checkmark"}
              >
                <ImCheckmark />
              </span>
            </IconContext.Provider>

            <IconContext.Provider
              value={{
                size: "1.1em",
                color: "#607D8B",
              }}
            >
              <span className="cancel" onClick={toggleEdit}>
                <ImCancelCircle />
              </span>
            </IconContext.Provider>
          </div>
        ) : (
          <div className="edit-mode-panel">
            <IconContext.Provider
              value={{
                size: "1.1em",
                color: "#607D8B",
              }}
            >
              <span className="edit-mode-link" onClick={toggleEdit}>
                <ImPencil />
              </span>
            </IconContext.Provider>
          </div>
        )}
      </td>
    </tr>
  );
}

export default ResultsRow;
