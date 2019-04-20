# SBA.gov Cypress Integration Tests

The suite of in-browser UI tests SBA.gov

## Running Cypress
Cypress can run in a few ways.  

1. Local Run - Cypress can be run locally to aid in test creation and development
1. Docker Run - Cypress can be run in a container to be used for development, scheduled testing, testing linked to builds in the deployment pipeline

### Local Run - Running cypress locally with the UI

#### Install cypress and dependencies

`npm install`

#### To run cypress normally
`./node_modules/.bin/cypress open`

#### To run cypress similar to automated runs
* `environment`: base environment name like "mint"
* `username`: drupal username
* `password`: drupal password

This will run Cypress using the `cypress open` command to use the Cypress UI for local testing and development

`./run-local.sh <environment> <username> <password>`

### Docker Run - Running Cypress in a docker container
**Please make sure to run this before checking in code to ensure that it will run remotely**
#### To Build the Docker Container
`./build.sh`

#### To run in Docker container
Runs the docker container locally with provided credentials
* `environment`: base environment name like "mint"
* `username`: drupal username
* `password`: drupal password


`./run-local-docker.sh <environment> <username> <password>`

#### To run in Docker container (with AWS param store credentials)

This uses the parameter store values in the AWS Account. 

* `environment`: base environment like "mint"
* `param-store-name`: the leading name of the param store like "mint"
`./run-param-store.sh <environment> <param-store-name>`


### To download the latest test results
`aws s3 sync s3://sbagovlower-test-results/cypress/<env>/latest/ .`

### To Deploy
`git tag latest -f && git push origin latest -f`

# Using Cypress

## Cypress Folder Structure
Everything essential for cypress is located in the `/cypress` folder.  You can read more about the folder structure within the [Cypress documentation](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure)

The only exception is how the `/integration` folder is structured.  This folder has two sub folders.
* `cypress/integration/tests`: contains all tests that should be automatically run.  The automatic processes that run tests look in here and run everything.  Only check in tests here that should ALWAYS be run and potentially often.
* `cypress/integration/tools`: Is a sandbox of tools for developers to use to aid in development and testing.  These tests are not automatically run and should be manually executed.  These are tests that might have special configurations or be templates for other tests that can be tweaked on the fly.

## Cypress Best Practices
Please be sure to follow the [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices.html) in building good tests.

Some additional best practices to consider are:
* Avoid unnecessary UI interactions - use a `cy.visit()` to go to a page directly rather than clicking your way through interfaces unless it is absolutely necessary to test the entire user flow.

# Project Details

## Changelog
Refer to the changelog for details on API updates. [CHANGELOG](CHANGELOG.md)

## License
The SBA.gov Integration Tests is licensed permissively under the Apache License v2.0.
A copy of that license is distributed with this software.

## Contributing
We welcome contributions. Please read [CONTRIBUTING](CONTRIBUTING.md) for how to contribute.

### Code Of Conduct

We strive for a welcoming and inclusive environment for the SBA.gov Integration Tests project.

Please follow this guidelines in all interactions:

1. Be Respectful: use welcoming and inclusive language.
2. Assume best intentions: seek to understand other's opinions.

## Security Issues
Please do not submit an issue on GitHub for a security vulnerability. Please contact the development team through [SBA Website Support](mailto:support@us-sba.atlassian.net).

Be sure to include all the pertinent information.

<sub>The agency reserves the right to change this policy at any time.</sub>