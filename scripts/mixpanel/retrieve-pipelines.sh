#!/bin/bash
curl --request GET \
	--url 'https://data.mixpanel.com/api/2.0/nessie/pipeline/jobs?project_id=$project_id' \
	--header 'accept: application/json' \
	--header 'authorization: Basic $token'
