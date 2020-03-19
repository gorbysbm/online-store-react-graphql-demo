/************ Utility Functions for APIs************/

Cypress.Commands.add("waitForGraphQLrequest", (alias, operationName) => {
    cy.wait(alias).then(({ request, response }) => {
        let queryFound = false;
        for (let key in request.body) {
            const opName = getOpName(request.body[key]);
            if (opName === operationName) {
                queryFound = true;
                return Cypress.Blob.blobToBase64String(response.body)
                    .then(x => atob(x))
                    .then(JSON.parse)
                    .then(x => {
                        return x;
                    });
            }
        }
        // If the captured request doesn't match the operation name of your query
        // it will wait again for the next one until it gets matched.
        if (request.body.operationName !== operationName && !queryFound) {
            return cy.waitForGraphQLrequest(alias, operationName);
        }
    });
});

function getOpName(body) {
    const opNameRegexp = /((query|mutation)\s)([a-zA-Z]*)\W/gm;
    const matches = opNameRegexp.exec(body.query);
    return body.operationName || matches[3];
}

function verifyNoErrorsInApiResponse(res) {
    if (res.body.errors) {
        expect(res.body.errors[0].message).to.not.exist;
    }
}