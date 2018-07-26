#!/bin/bash
sed -i "s#@@BASE_URL@@#${BASE_URL}#" /app/cypress.json
sed -i "s#@@TEST_USER@@#${TEST_USER}#" /app/cypress.json
sed -i "s#@@TEST_PASSWORD@@#${TEST_PASSWORD}#" /app/cypress.json
echo -e "\nRunning with config:"
echo -e "\n----------------------------------\n"
cat /app/cypress.json
echo -e "\n----------------------------------\n"
node_modules/.bin/cypress run -c /app/cypress.json --spec '/app/cypress/integration/**/*.js' 

TIMESTAMP=$(date +%Y-%m-%dT%H%MZ)

if [ -z ${S3BUCKET+x} ]
then 
    echo "Execution Complete" 
else 
    TARGET_URI="s3://${S3BUCKET}/cypress/${TARGET_ENV}"
    echo "Uploading to ${TARGET_URI}"
    aws s3 sync /app/mochawesome-report/ ${TARGET_URI}/${TIMESTAMP}/mochawesome-report
    aws s3 sync /app/cypress/screenshots/ ${TARGET_URI}/${TIMESTAMP}/screenshots
    aws s3 sync /app/cypress/videos/ ${TARGET_URI}/${TIMESTAMP}/videos
    aws s3 sync "${TARGET_URI}/${TIMESTAMP}" "${TARGET_URI}/latest" --delete
    echo "Upload Complete"
fi