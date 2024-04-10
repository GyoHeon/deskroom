#!/bin/bash
# Create a service principal
# - https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest
# - https://docs.mixpanel.com/docs/data-pipelines/integrations/azure-blob-storage#edit-mixpanel-permission
az ad sp create-for-rbac --sdk-auth
