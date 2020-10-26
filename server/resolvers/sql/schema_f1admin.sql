begin;

drop schema if exists f1admin cascade;
create schema f1admin;

drop table if exists f1admin.drivers;
create table f1admin.drivers
(
  driverid  serial primary key,
  driverref text not null check (driverref <> ''),
  number    integer, 
  code      varchar(3),
  forename  text not null check (forename <> ''),
  surname   text not null check (surname <> ''),
  dob       date not null, 
  nationality text,
  url       text unique,
  unique(forename, surname, dob)
);

drop table if exists f1admin.races;
create table f1admin.races
(
  raceid serial primary key,
  name text not null check (name <> ''),
  datetime timestamptz not null,
  round integer not null,
  year integer not null
);

drop table if exists f1admin.results;
create table f1admin.results 
(
  resultid serial primary key,
  raceid integer not null references f1admin.races,
  driverid integer not null references f1admin.drivers,
  laps integer,
  time text,
  unique(raceid, driverid)
);

commit;