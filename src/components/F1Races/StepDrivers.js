import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { format } from "date-fns";

const ACTIVE_DRIVERS = gql`
  query ActiveDrivers {
    activeDrivers {
      driverid
      fullname
    }
  }
`;

function StepDrivers({ info, setInfo, previousStep, nextStep }) {
  const [participants, setParticipants] = useState([]);
  const [selectall, setSelectall] = useState(false);
  const { loading, error, data } = useQuery(ACTIVE_DRIVERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const drivers = data.activeDrivers ? data.activeDrivers : [];

  const toggleSelectall = () => {
    if (!selectall) {
      const checklist = drivers.map(driver => {
        return {
          ...driver, 
          isChecked: true,
        }
      })
      updateParticipants([...checklist])
    } else {
      updateParticipants([])
    }
    setSelectall(prev => !prev)
  }
  
  const updateParticipants = (update) => {
    setParticipants(update);
  };

  const handleDriverSelection = (event) => {    
    const value = event.target.value;
    const textContent = event.target.textContent;
    const fullname = textContent || value;
    if (!fullname || fullname.length === 0) return;

    // avoid duplicate participant entry
    const duplicates = participants.filter((d) => d.fullname === fullname);
    if (duplicates.length > 0) return;

    // find selected driver
    const selectedDriver = drivers.filter((d) => d.fullname === fullname)[0];
    const newParticipant = {
      ...selectedDriver,
      isChecked: true,
    };

    const update = [...participants, newParticipant];
    updateParticipants(update);
  };

  const handleCheckbox = (event) => {    
    if (event.target && event.target.value) {
      const filtered = participants.filter((driver) => 
        driver.driverid !== parseInt(event.target.value)
      );
      const update = [...filtered];
      updateParticipants(update);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    const driveridlist = participants.map((driver) => driver.driverid);
    setInfo({
      ...info,
      participants,
      driveridlist,
    });
    nextStep();
  };

  let isEnableButton = participants.length > 1;

  return (
    <>
      <form className="step-drivers">
        <div>
          <h3 className="section-title">{`${info.name} – Round ${info.round}`}</h3>
          <p>{format(info.datetime, "M/dd/yyyy h:mm a")}</p>
          <Autocomplete
            id="f1-active-drivers"
            autoComplete
            options={drivers}
            onChange={handleDriverSelection}
            getOptionLabel={(option) => option.fullname}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="F1 Drivers" variant="outlined" onKeyPress={event => {
                if (event.key === 'Enter') event.preventDefault();
              }}/>
            )}
          />
        </div>
        <div>
          {participants.length < 1 ? (
            <p className="instructions">Select participating F1 drivers</p>
          ) : (
              <label>Participating Drivers:</label>                                                
          )}
          <label>
            <input
              className="check-participate"
              name="selectall"                    
              type="checkbox"
              onChange={toggleSelectall}
              checked={selectall}
            />
            Select all 
          </label>              
          <ul id="participants">
            {participants.map((driver) => (
              <li key={driver.driverid}>
                <label>
                  <input
                    className="check-participate"
                    name={driver.fullname}
                    value={driver.driverid}
                    type="checkbox"
                    onChange={handleCheckbox}
                    checked={driver.isChecked}
                  />
                  {driver.fullname}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-actions">
          <Button variant="contained" onClick={previousStep}>
            Previous
          </Button>
          <Button
            onClick={handleSave}
            className="submit-button"
            disabled={!isEnableButton}
            variant="contained"
            color="primary"
          >
            Add F1 Race
          </Button>
        </div>
      </form>
    </>
  );
}

export default StepDrivers;
