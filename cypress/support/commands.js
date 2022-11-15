//for use with page elements that include static 'data-testid' attributes.
Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]`, ...args);
  })
  
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
    return cy.get(`[data-testid*=${selector}]`, ...args);
  })

//some common commands we likely want to run with most tests.  adding here for easy maintenance should targeted elements change.
Cypress.Commands.add('successModalTrue', () => {
    cy.get('.Toastify__toast-container').should('exist')
      .contains('Test Kit Retrieved');
  });

Cypress.Commands.add('errorModalTrue', () => {
    cy.get('.Toastify__toast-container').should('exist')
      .contains('No Test Kit Found');
  });

Cypress.Commands.add('resultsTrue', () => {
    cy.get('.results-container').should('exist');

  });

//pass in the 'sampleCount' of pre-populated values we want to add as part of our spec tests.
Cypress.Commands.add('addSample', (sampleCount) => {
    //logic for when no sampleCount is passed in (will use 1).
    if (!sampleCount) {
        const sampleCount = 1
        var i = 0;
            for (i = 0; i < sampleCount ; i++) {
                cy.get('#mui-2').click()
                cy.get(`#mui-2-option-${i}`).click();
        }
    } else {
        var i = 0;
            for (i = 0; i < sampleCount ; i++) {
                cy.get('#mui-2').click()
                cy.get(`#mui-2-option-${i}`).click();
        }
    }
    cy.get('#mui-2').clear();
});

//allows us to easily search for any criteria regardless of whether there are results populated.
Cypress.Commands.add('addSampleBySearch', (search) => {
    cy.get('#mui-2').type(search)

    cy.get('body')
        //synchronously query from entire body.
        .then(($body) => {
            //see if search results dropdown populates for criteria given.
            if ($body.find('#mui-2-listbox').length) {
                //if results populate, click first one.
                cy.get('#mui-2-option-0').click()
                cy.get('#mui-2').clear();
            } else {
                //if nothing populates, type enter key anyway.
                cy.get('#mui-2').type('{enter}')
                cy.get('#mui-2').clear();
            }
        })
});

Cypress.Commands.add('sampleByDataJson', function () {
    //uses the 'KITS_SHIPPING_DATA.json' file as a fixture and passes back a random label_id value.
    return cy.fixture('../../src/data/KITS_SHIPPING_DATA.json')
        .then(kitJsonData => {
            this.kitJsonData = kitJsonData
            return this.kitJsonData.shipping_data[[Math.floor(Math.random() * this.kitJsonData.shipping_data.length)]].label_id;
        });
});

Cypress.Commands.add('badString', function () {
    //command that uses the 'blns' repo to grab a random 'bad' string here.
    return cy.fixture('../../node_modules/big-list-of-naughty-strings/blns.json')
        .then(blns => {
            return blns[Math.floor(Math.random() * blns.length)];
        });
});

//assert UI isn't returning label or tracking ids in unexpected format
Cypress.Commands.add('regexLabelId', () => {
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(1)').contains(/\d\d\D\d\d\d\D\d\d\d\d/)
});

Cypress.Commands.add('regexTrackingId', () => {
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)').contains(/\d\d\d\d\d\d\d\d\d\d/)
});