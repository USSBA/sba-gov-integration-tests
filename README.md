# Running Cypress
## To Build
`./build.sh`

## To Run (with the Cypress UI)
This will run Cypress using the `cypress open` command to use the Cypress UI for local testing and development

`./run-local.sh <environment> <username> <password>`

## To Run (with docker)
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