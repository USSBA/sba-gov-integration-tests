# Running Cypress
Cypress can run in a few ways.  

1. Local Run - Cypress can be run locally to aid in test creation and development
1. Docker Run - Cypress can be run in a container to be used for scheduled testing or testing linked to builds in the deployment pipeline

Note:  For the time being, in both cases, when running cypress like the automatically scheduled tests, we will need to run via the script to provide a Drupal username/password and setup the approrpiate environment variables.

## Local Run - Running cypress locally with the UI

### Install cypress and dependencies

`npm install`

### To run cypress normally
`./node_modules/.bin/cypress open`

### To run cypress similar to automated runs
* `environment`: base environment name like "mint", "avery", "demo"
* `username`: drupal username
* `password`: drupal password

This will run Cypress using the `cypress open` command to use the Cypress UI for local testing and development

`./run-local.sh <environment> <username> <password>`

## Docker Run - Running Cypress in a docker container

### To Build the Docker Container
`./build.sh`

### To run all tests in the docker container

This uses the parameter store values in the AWS Account. 
**Please make sure to run this before checking in code to ensure that it will run remotely**

`./run-local-docker.sh <environment>`

## To download the latest test results
`aws s3 sync s3://sbagovlower-test-results/cypress/<env>/latest/ .`

## To Deploy
`git tag latest -f && git push origin latest -f`

# Cypress Best Practices
Please be sure to follow the [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices.html) in building good tests.

Some additional best practices to consider are:
* Avoid unnecessary UI interactions - use a `cy.visit()` to go to a page directly rather than clicking your way through interfaces unless it is absolutely necessary to test the entire user flow.