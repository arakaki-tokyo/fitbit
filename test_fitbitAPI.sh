#!/bin/bash

HEADER="Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM0IzVk0iLCJzdWIiOiI5QjJQQ1QiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNjE5NTE3MjcwLCJpYXQiOjE2MTg5MTI0NzB9.yyYpABAhBM4VM-lpYSiIhB2NDRiMUeQ7CFDNWKb3b1I"
URL="https://api.fitbit.com/1/user/-/profile.json"

HR="https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/00:00/00:01.json"
HR1="https://api.fitbit.com/1/user/-/activities/heart/date/2021-04-23/1d/1sec/time/05:15/23:59.json"
HR1_1="https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/05:15.json"
HR2="https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json"
HR4="https://api.fitbit.com/1/user/-/activities/heart/date/2021-04-25/1d/1sec.json"
HR3="https://api.fitbit.com/1/user/-/activities/heart/date/2021-04-18/2021-04-20/1sec.json"


URL=${HR2}
 curl -H "${HEADER}" ${URL} | jq .


