#!/bin/bash
docker run -e "BASE_URL=https://content.${1}" \
-e "S3BUCKET=sbagovlower-test-results" \
-e "TARGET_ENV=${1}"  -e "TEST_USER_PARAM_STORE_NAME=${2}"  -e "TEST_PASSWORD_VALUE_PARAM_STORE_NAME=${3}" -v ~/.aws:/home/chrome/.aws sba-gov-integration-tests