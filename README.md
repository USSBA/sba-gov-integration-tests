## To Build
`./build.sh`

## To Run
`./run.sh <environment> <username> <password>`

## To Run Using the parameter store values in the AWS ACcount
`./run.sh <environment>`


## To download the latest test results
`aws s3 sync s3://sbagovlower-test-results/cypress/<env>/latest/ .`

