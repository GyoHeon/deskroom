#!/bin/bash
# Create a pipeline for Azure Blob Storage
# - https://docs.mixpanel.com/docs/data-pipelines/integrations/azure-blob-storage
curl --request POST \
	--url https://data.mixpanel.com/api/2.0/nessie/pipeline/create \
	--header 'accept: application/json' \
	--header 'content-type: application/x-www-form-urlencoded' \
	--data type=azure-blob \
	--data trial=false \
	--data data_source=events \
	--data frequency=hourly \
	--data data_format=json \
	--data gcs_region=northamerica-northeast1 \
	--data project_id=$project_id \
	--data schema_type=monoschema \
	--data from_date=$from_date \
	--data client_id=$client_id \
	--data 'client_secret=$client_secret' \
	--data tenant_id=$tenant_id \
	--data storage_account=$storage_account \
	--data container_name=$container_name
