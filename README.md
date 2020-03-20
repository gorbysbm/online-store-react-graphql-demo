Sample Cypress automation tests to ensure the quality of our UI and API's
### `online-store-react-graphql-demo` (An Example Web + GraphQL App) 

Start demo server with :`npm run demo`


### Running the Tests via the GUI:

* navigate to the root project directory and run this command while specifying the environment for your `configFile` e.g.:
```
        npx cypress open --env configFile=localhost
```

### Running the Tests via the command line:

* navigate to the root project directory and run this command while specifying the environment for your `configFile` e.g.:
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
