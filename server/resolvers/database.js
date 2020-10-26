const { pool } = require("./config");

/* Update F1 results */

async function updateRaceResultFor(_, { raceid, driverid, input }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      update f1admin.results 
      set laps = $3, time = $4 
      where raceid = $1
      and driverid = $2
      returning *;
      `,
      [raceid, driverid, input.laps, input.time]
    );
    if (!result.rows || result.rows.length === 0) return null;
    const updatedRecord = result.rows[0];
    return updatedRecord;
  } finally {
    client.release();
  }
}

/* Query info and participating drivers of an F1 race */

function transform(rows) {
  const drivers = rows.map((result) => {
    return {
      driverid: result.driverid,
      fullname: result.fullname,      
      laps: result.laps,
      time: result.time,
    };
  });
  return {
    raceid: rows[0].raceid,
    name: rows[0].name,
    round: rows[0].round,
    year: rows[0].year,
    datetime: rows[0].datetime,
    drivers,
  };
}
async function raceInfoOf(_, { raceid }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      select raceid, name, round, year, datetime, driverid,
        forename || ' ' || surname as fullname, laps, time
      from f1admin.results
      join f1admin.races using(raceid)
      join f1admin.drivers using(driverid)
      where raceid = $1
      order by fullname;
      `,
      [raceid]
    );
    if (!result.rows || result.rows.length === 0) return null;
    // console.log(result.rows);
    const transformed = transform(result.rows);
    // console.log(transformed);
    return transformed;
  } finally {
    client.release();
  }
}

/* Query F1 races */

async function races(_, { obj }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      select raceid, name, round, year, datetime 
      from f1admin.races
      where datetime > now() - interval '3 month'
      order by datetime desc;
      `
    );
    if (!result.rows || result.rows.length === 0) return [];
    // console.log(result.rows);
    return result.rows;
  } finally {
    client.release();
  }
}

/* Query for F1 drivers */

async function activeDrivers(_, { obj }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      select distinct(driverid),
        forename || ' ' || surname as fullname
      from formula1.results
      join formula1.races using(raceid)
      join formula1.drivers using(driverid)
      where races.date > now() - interval '12 months'
      order by fullname
      `
    );
    if (!result.rows || result.rows.length === 0) return [];
    return result.rows;
  } finally {
    client.release();
  }
}

/*
 * Create a new F1 race in races table along with participant 
 * rows in results table in a single transaction
 * 
 * Example: insert into f1admin.results(raceid, driverid)
 *          values (1,1), (1,2), (1,3), (1, 4), (1, 5)
 */

// Output string: (1,1),
function nextValue(raceid, driverid) {
  return `(${raceid}, ${driverid}),`;
}

// Output string: (1,1), (1,2), (1,3), (1, 4), (1, 5)
function buildValues(raceid, driveridlist) {
  let length = driveridlist.length;
  let values = "";
  for (let i = 0; i < length - 1; i++) {
    values = values + nextValue(raceid, driveridlist[i]);
  }
  values = values + `(${raceid}, ${driveridlist[length - 1]})`;
  return values;
}

// Transaction
async function createRace(_, { input }) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const addRace = await client.query(
      `insert into f1admin.races(name, round, datetime, year) 
      values($1, $2, $3, $4) 
      returning raceid`,
      [input.name, input.round, input.datetime, input.year]
    );
    const newRecord = addRace.rows[0];
    const driveridlist = input.driveridlist; //eg [1, 2, 3, 4, 5];
    const valuesString = buildValues(newRecord.raceid, driveridlist);
    const batchParticipants =
      `insert into f1admin.results(raceid, driverid) 
      values ${valuesString}`;
    console.log(batchParticipants);
    await client.query(batchParticipants);
    await client.query("commit");
    return {
      ...newRecord,
      ...input,
    };
  } catch (error) {
    await client.query("rollback");
  } finally {
    client.release();
  }
}

module.exports = {
  createRace,
  races,
  activeDrivers,
  raceInfoOf,
  updateRaceResultFor,
};
