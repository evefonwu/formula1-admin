-- race info with participating drivers 

select raceid, name, round, year, datetime, driverid,
	forename || ' ' || surname as fullname
from f1admin.results
join f1admin.races using(raceid)
join f1admin.drivers using(driverid)
where raceid = 1
order by fullname;

-- replace constant string with parameter variables 