#!/bin/bash
./build.sh
docker run \
-e "BASE_URL=https://${1}.ussba.io" \
-e "TARGET_ENV=${1}" \
-e "TEST_USER=${2}" \
-e "TEST_PASSWORD=${3}" \
-e "TEST_FILE_TO_RUN=${4}" \
-v ~/.aws:/home/chrome/.aws sba-gov-integration-tests