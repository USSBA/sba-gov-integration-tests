#!/bin/bash
docker run -e "BASE_URL=https://content.${1}" \
-e "S3BUCKET=sbagovlower-test-results" \
-e "TARGET_ENV=${1}" -e "ENVIRONMENT_NAME=${2}" -e "TEST_USER_PARAM_STORE_NAME=/${2}/integration-tests/test-user"  -e "TEST_PASSWORD_PARAM_STORE_NAME=/${2}/integration-tests/test-password" -v ~/.aws:/home/chrome/.aws sba-gov-integration-tests