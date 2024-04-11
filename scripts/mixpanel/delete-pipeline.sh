#!/bin/bash
curl --request POST \
	--url https://data.mixpanel.com/api/2.0/nessie/pipeline/cancel \
	--header 'accept: application/json' \
	--header 'authorization: Basic $token' \
	--header 'content-type: application/x-www-form-urlencoded' \
	--data name=events-daily-azure-blob-monoschema \
	--data project_id=$project_id
