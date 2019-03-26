### Requirements

## login.test.js
1. Drupal 8 is running on the target system given by the BASE_URL environment on content.{BASE_URL}
2. The user that is used for testing exists in Drupal 8
3. Two Parameter Store values `/{env}/integration-tests/test-user` and `/{env}/integration-tests/test-password` contains the appropriate values for the aforementioned user
4. Any S3 Bucket given in the S3Bucket environment variable must already exist
