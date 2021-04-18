#!/bin/bash

HEADER="Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM0IzVk0iLCJzdWIiOiI5QjJQQ1QiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjE4NzY5MjY2LCJpYXQiOjE2MTg2ODI4NjZ9.aD99OVEpc2dc5QGRp2A5DWphimpsUXntZnlJJbMpeck"
URL="https://api.fitbit.com/1/user/-/profile.json"

HR="https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec/time/00:00/00:01.json"
HR2="https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json"


URL=${HR2}
 curl -H "${HEADER}" ${URL} | jq .


