import React, { useState } from "react";
import StepInfo from "./StepInfo";
import StepDrivers from "./StepDrivers";
import StepSave from "./StepSave";

const initInfo = {
  name: "",
  round: 1,
  datetime: new Date(),
  driveridlist: [],
};

export default function CreateRace() {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState(initInfo);
  const nextStep = () => setStep((prev) => prev + 1);
  const previousStep = () => setStep((prev) => prev - 1);

  function multistepContent(index) {
    switch (index) {
      case 1:
        return <StepInfo nextStep={nextStep} info={info} setInfo={setInfo} />;
      case 2:
        return (
          <StepDrivers
            previousStep={previousStep}
            nextStep={nextStep}
            info={info}
            setInfo={setInfo}
          />
        );
      case 3:
        return <StepSave info={info} />;
      default:
        setStep(1);
    }
  }

  return (
    <div className="container">
      {multistepContent(step)}
    </div>
  );
}
