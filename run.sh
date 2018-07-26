#!/bin/bash
docker run -e "BASE_URL=https://content.${1}" \
-e "TARGET_ENV=${1}"  -e "TEST_USER=${2}"  -e "TEST_PASSWORD=${3}" -v ~/.aws:/home/chrome/.aws sba-gov-integration-tests