-- drivers with races held within the last 12 months

-- formula1 schema

select distinct(driverid),
  forename || ' ' || surname as fullname
from formula1.results
join formula1.races using(raceid)
join formula1.drivers using(driverid)
where races.date > now() - interval '12 months'
order by fullname
