import React, { useState } from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";

const init = {
  name: "",
  round: "",
  datetime: new Date(),
};
function StepInfo({ info, setInfo, nextStep }) {
  const [message, setMessage] = useState({});
  const [form, setForm] = useState(info || init);

  const handleContinue = (event) => {
    event.preventDefault();
    setInfo({
      ...form,
    });
    nextStep();
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      datetime: date,
    });
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    let message = {}
    if (event.target.name === "name") {
      if (!validName(event.target.value)) {
        message.name = "invalid name";
      } else {
        message.name = null;
      }
    } else if (event.target.name === "round") {
      if (!validRound(event.target.value)) {
        message.round = "invalid round";
      } else {
        message.round = null;
      }
    }
    setMessage(message)
  };

  const validName = (name) => {
    return name && name.trim().length > 1;
  };

  const validRound = (round) => {
    if (!round) return false;
    const intRound = parseInt(round);
    if (isNaN(intRound)) return false;
    return intRound > 0;
  };

  let isEnabledButton = (validName(form.name) && validRound(form.round));

  return (
    <div className="f1-race-form">
      <h3 className="section-title">Add New F1 Race</h3>
      <form className="step-info">
        <div className="select-date">
          <label htmlFor="date">Date</label>
          <div className="date-component">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                value={form.datetime}
                onChange={(date) => handleDateChange(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div className="info-entry">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              placeholder="eg Australian Gran Prix"
              data-message={message.name && "error"}
            />
            {message.name && (
              <span className="error-message">{message.name}</span>
            )}
          </div>
          <div>
            <label htmlFor="round">Round</label>
            <input
              type="number"
              min={1}
              max={30}
              name="round"
              id="round"
              value={form.round}
              onChange={handleChange}
              data-message={message.round && "error"}
            />
            {message.round && (
              <span className="error-message">{message.round}</span>
            )}
          </div>
        </div>
        <div className="form-actions">
          <Button
            type="submit"
            className="submit-button"
            onClick={handleContinue}
            variant="contained"
            color="primary"
            disabled={!isEnabledButton}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StepInfo;
