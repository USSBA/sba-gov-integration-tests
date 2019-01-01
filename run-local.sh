#!/bin/bash
export CYPRESS_BASE_URL="https://${1}.ussba.io" 
export CYPRESS_TARGET_ENV="${1}" 
export CYPRESS_TEST_USER="${2}" 
export CYPRESS_TEST_PASSWORD="${3}" 
./node_modules/.bin/cypress open --config chromeWebSecurity=false
