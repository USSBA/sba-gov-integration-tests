# SBA.gov Cypress Integration Tests

The suite of in-browser UI tests SBA.gov

## Running Cypress
Cypress can run in a few ways.  

1. Local Run - Cypress can be run locally to aid in test creation and development
1. Docker Run - Cypress can be run in a container to be used for development, scheduled testing, testing linked to builds in the deployment pipeline

### Local Run - Running cypress locally with the UI

#### Install cypress and dependencies

`npm install`

### Run cypress normally
`npx cypress open`

or...

### Run cypress w/ environment variables to run the drupal tests

`./run-cypress.sh <environment> <drupal-username> <drupal-password>` 

This will run Cypress using the `cypress open` command to use the Cypress UI for local testing and development.

## Docker Run - Running cypress in a Docker container
This is how the automatic runs are executed.
* `environment`: base environment name like "mint", "avery"
* `param-store-name`: the name of the aws param store to use to get drupal username and password
* `file`: specific test file to run

**Please make sure to run this before checking in code to ensure that it will run remotely**

`./run-cypress-docker.sh <environment> <param-store-name> [file]`

### To Build the Docker Container
`./build.sh`

## Download the latest test results
`aws s3 sync s3://sbagovlower-test-results/cypress/<environment>/latest/ .`

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