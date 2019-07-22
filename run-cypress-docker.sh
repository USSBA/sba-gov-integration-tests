#!/bin/bash
FRONTEND_ENV=${1:-mint}
AWS_ENV=${2:-$FRONTEND_ENV}
TESTS_PATH=$3

./build.sh
docker run \
--ipc=host \
-e "BASE_URL=https://${FRONTEND_ENV}.ussba.io" \
-e "S3BUCKET=sbagovlower-test-results" \
-e "TARGET_ENV=${FRONTEND_ENV}" \
-e "ENVIRONMENT_NAME=${FRONTEND_ENV}" \
-e "TEST_USER_PARAM_STORE_NAME=/${AWS_ENV}/integration-tests/test-user" \
-e "TEST_PASSWORD_PARAM_STORE_NAME=/${AWS_ENV}/integration-tests/test-password" \
-e "TEST_FILE_TO_RUN=${TESTS_PATH}" \
-v ~/.aws:/home/chrome/.aws sba-gov-integration-tests