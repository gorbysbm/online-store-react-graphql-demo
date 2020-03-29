Sample Cypress automation tests to ensure UI and API quality. Tests will be run against an example React + GraphQL App 
### Start demo app server with : 

`npm run demo`


### Running the Cypress Tests via the GUI:

*  run this command while specifying the environment for your `configFile` e.g.:
```
        npx cypress open --env configFile=localhost
```

### Running the Cypress Tests via the command line:

* run this command while specifying the environment for your `configFile` e.g.:
```
        npx cypress run --env configFile=localhost
```
* optional flags:
     * record test results to Cypress Dashboard: `--record --key <SECRET_KEY>` 
          <br>Note: the Secret Key can be found in your Cypress Dashboard Settings
    * run only a specific spec file: `--spec "cypress/integration/my_spec.js"`
    * run only a specific test in a spec file by adding `it.only()` inside your code; *WARNING:* do not check in code
    with `it.only` -- this is used for debugging a specific test only.

### Updating / Running using specific Versions:
```
npm install cypress@<4.0.1> --save-dev //update to a specific version
npx cypress@<4.0.1> open  // run a specific version
```

## Cypress Dashboard

You can also see the results of the  CI runs in the [Cypress Dashboard](https://dashboard.cypress.io/projects/gxf8ak/runs)


## Known Cypress Limitations
[Cypress GraphQL mocking issues](https://github.com/cypress-io/cypress-documentation/issues/122) 
