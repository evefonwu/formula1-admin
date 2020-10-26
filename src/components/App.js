import React from "react";
import { Switch, Route } from "react-router-dom";

import Header from "./Header";
import RaceList from "./F1Races/RaceList";
import CreateRace from "./F1Races/CreateRace";
import RaceInfo from "./F1Races/RaceInfo";

function App() {
  return (    
    <div>
      <Header />
      <div>
        <Switch>
          <Route exact path="/races" component={RaceList} />
          <Route exact path="/race/create" component={CreateRace} />
          <Route exact path="/race/:raceid" component={RaceInfo} />
        </Switch>
      </div>
    </div>    
  );
}

export default App;
