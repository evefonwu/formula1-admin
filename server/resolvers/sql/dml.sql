-- single quotes around constant strings
insert into f1admin.races(name, round, year, datetime) values('Australian Gran Prix', 3, 2020, '2020-10-19T23:32:34.209Z') returning raceid

-- batch value inserts, comma separated values in parenthesis
insert into f1admin.results(raceid, driverid) values (1,1), (1,2), (1,3), (1, 4), (1, 5)

