```
query {
  races {
    raceid
    name
    round
    year
    datetime
  }
}

query($raceid: Int!) {
  raceInfoOf(raceid: $raceid) {
    name
    round
    year
    datetime
    drivers {
      driverid
      fullname
    }
  }
}

query {
  activeDrivers {
    driverid
    fullname
  }
}

mutation CreateRace($input: RaceInput!){
  createRace(input: $input) {
      raceid
      name
  }
}
{
  "input": {
    	"name": "Gran Prix",
      "round": 3,
      "year": 2020,
      "datetime": "2020-10-19T23:32:34.209Z",
      "driveridlist": [1, 2, 3, 4, 5]
    }
}

mutation{
  createRace(input: {
    	name: "Gran Prix",
      round: 3,
      year: 2020,
      datetime: "2020-10-19T23:32:34.209Z",
      driveridlist: [1, 2, 3, 4, 5]
    }) {
      raceid
      name
  }
}

mutation {
  updateRaceResultFor(raceid: 1, driverid: 27, input: {
    laps: 58
    "time": "1:58:23.534"
  }) {
    resultid
    raceid
    driverid
    laps
    time
  }
}

mutation UpdateRaceResultFor($raceid: Int!, $driverid: Int!, $input: ResultInput!){
  updateRaceResultFor(raceid: $raceid, driverid: $driverid, input: $input) {
    laps
    time
  }
}
{
  "raceid": 1,
  "driverid": 1,
  "input": {
      "laps": 58,
      "time": "1:58:23.534"
    }
}
```
