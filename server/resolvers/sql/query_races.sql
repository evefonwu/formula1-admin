-- races within the last 3 months

-- f1admin schema
select raceid, name, round, year, datetime 
from f1admin.races
where datetime > now() - interval '3 month'
order by datetime desc;

-- formula1 schema
select raceid, name, date, races.time as race_time, driverid,
	forename || ' ' || surname as fullname, laps, results.time as results_time, position
from formula1.results
join formula1.races using(raceid)
join formula1.drivers using(driverid)
where date > now() - interval '3 month'
order by position;

-- 70th Anniversary Grand Prix
select raceid, name, date, races.time as race_time, driverid,
	forename || ' ' || surname as fullname, laps, results.time as results_time, position
from formula1.results
join formula1.races using(raceid)
join formula1.drivers using(driverid)
where raceid = 1035
order by position;

select forename || ' ' || surname as fullname, laps, results.time as results_time
from formula1.results
join formula1.races using(raceid)
join formula1.drivers using(driverid)
where raceid = 1035;
