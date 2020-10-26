/* 
 * Based on f1bd schema http://ergast.com/schemas/f1db_schema.txt
 */

begin;

drop schema if exists formula1 cascade;
create schema formula1;

drop table if exists formula1.races;
create table formula1.races
(
  raceId  serial primary key,
  year    integer DEFAULT 0 not null,
  round   integer DEFAULT 0 not null,
  circuitId integer DEFAULT 0 not null,
  name    varchar(255) not null check (name <> ''),
  date    date not null,
  time    time,
  url     varchar(255) unique,
  unique(year, round, name, date)
);

drop table if exists formula1.results;
create table formula1.results
(
  resultId        serial primary key,
  raceId          integer references formula1.races(raceId),
  driverId        integer references formula1.drivers(driverId),
  constructorId   integer references formula1.constructors(constructorId),
  number          integer,
  grid            integer not null DEFAULT 0,
  position        integer,
  positionText    varchar(255) not null,
  positionOrder   integer not null DEFAULT 0,
  points          float not null DEFAULT 0,
  laps            integer not null DEFAULT 0,
  time            varchar(255),
  milliseconds    integer,
  fastestLap      integer,
  rank            integer DEFAULT 0,
  fastestLapTime  varchar(255),
  fastestLapSpeed varchar(255),
  statusId        integer DEFAULT 0,
  unique(raceId, driverId, position)
);

commit;