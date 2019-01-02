#!/bin/bash
# echo "TEST_USER_PARAM_STORE_NAME=${TEST_USER_PARAM_STORE_NAME}%%%%%"
BASE_URL_VALUE=${BASE_URL}
TEST_USER_VALUE=${TEST_USER}
TEST_PASSWORD_VALUE=${TEST_PASSWORD}

function getparameterstore () {
  ENV_NAME=$1
  PARAMETER_STORE_NAME=$2
  echo "Getting parameter ENV_NAME=${ENV_NAME}, PARAMETER_STORE_NAME=${PARAMETER_STORE_NAME}"
  echo "Testing pulling data from ParameterStore..."
  aws ssm get-parameter --name "${PARAMETER_STORE_NAME}" > /dev/null && echo "Success ${PARAMETER_STORE_NAME}" || ( echo "FATAL: Could not retrieve ParameterStore value '${PARAMETER_STORE_NAME}'"; exit 10; )
  export $ENV_NAME=$(aws ssm get-parameter --name "${PARAMETER_STORE_NAME}" | jq .Parameter.Value -r)

  if [ -z "${!ENV_NAME}" ]; then
    echo "FATAL: Could not retrieve ParameterStore value '${PARAMETER_STORE_NAME}'"
    exit 15
  else
    echo "Successfully loaded ${ENV_NAME}"
  fi
}

if [ ! -z "${TEST_USER_PARAM_STORE_NAME}" ]
then
    getparameterstore TEST_USER_VALUE ${TEST_USER_PARAM_STORE_NAME}
fi

if [ ! -z ${TEST_PASSWORD_PARAM_STORE_NAME} ]
then
    getparameterstore TEST_PASSWORD_VALUE ${TEST_PASSWORD_PARAM_STORE_NAME}
fi


sed -i "s#@@BASE_URL@@#${BASE_URL_VALUE}#" /app/cypress.json
sed -i "s#@@TEST_USER@@#${TEST_USER_VALUE}#" /app/cypress.json
sed -i "s#@@TEST_PASSWORD@@#${TEST_PASSWORD_VALUE}#" /app/cypress.json
echo -e "\nRunning with config:"
echo -e "\n----------------------------------\n"
cat /app/cypress.json
echo -e "\n----------------------------------\n"
node_modules/.bin/cypress run -c /app/cypress.json --spec '/app/cypress/integration/tests/**/*.js' 

TIMESTAMP=$(date +%Y-%m-%dT%H%MZ)

if [ -z ${S3BUCKET+x} ]
then 
    echo "Execution Complete" 
else 
    echo "Merging mochawesome jsons"
    node_modules/.bin/mochawesome-merge --reportDir /app/mochawesome-report > /app/mochawesome-report/merged.json
    node_modules/.bin/marge --reportFilename /app/mochawesome-report/mochawesome.html /app/mochawesome-report/merged.json 
    TARGET_URI="s3://${S3BUCKET}/cypress/${TARGET_ENV}"
    echo "Uploading to ${TARGET_URI}"
    aws s3 sync /app/mochawesome-report/ ${TARGET_URI}/${TIMESTAMP}/mochawesome-report
    aws s3 sync /app/cypress/screenshots/ ${TARGET_URI}/${TIMESTAMP}/screenshots
    aws s3 sync /app/cypress/videos/ ${TARGET_URI}/${TIMESTAMP}/videos
    aws s3 sync "${TARGET_URI}/${TIMESTAMP}" "${TARGET_URI}/latest" --delete
    echo "Upload Complete"
    FUNCTION_NAME="${ENVIRONMENT_NAME}-SlackBuildAlertsLambda"
    echo "Invoking Lambda ${FUNCTION_NAME}"
    aws lambda invoke --function-name "${FUNCTION_NAME}" /tmp/outfile.txt
    echo "Done!"
fi