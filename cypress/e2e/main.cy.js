/// <reference types="cypress" />

describe('Page Object Checks', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('mainUrl'));

  });

  it('loads main search dashboard', () => {
    cy.url().should('eq', 'http://localhost:3000/')
    cy.title().should('eq', 'Biobot Search Example')
    cy.get('.app-logo').should('exist')
    cy.get('.app-header').contains('Welcome to the Biobot Test Kit Search App')
    cy.get('.search-box-container').should('be.visible');
  
  });

  it('should always display label Id placeholder text in the search box', () => {
    cy.get('#mui-2-label').should('contain.text', 'Label Id')
    cy.get('#mui-2').click()
    cy.get('#mui-2-label').should('contain.text', 'Label Id')
    cy.get('#mui-2').type('populate')
    cy.get('#mui-2-label').should('contain.text', 'Label Id')
    cy.get('#mui-2').clear()
    cy.get('.app').click()
    cy.get('#mui-2-label').should('contain.text', 'Label Id')
  
  });

  it('should display search/clear buttons under correct circumstances', () => {
    cy.getBySel('SearchIcon').should('exist')
    cy.getBySel('CloseIcon').should('not.exist')
    cy.get('#mui-2').type('populate')
    cy.getBySel('CloseIcon').should('exist')
    cy.get('#mui-2').clear()
    cy.get('.app').click()
    cy.getBySel('CloseIcon').should('not.exist')
  
  });

  it('should display caption after populating search results', () => {
    cy.addSample();
    cy.successModalTrue();
  
    cy.get('caption')
      .should('exist')
      .contains('Table containing test kit shipping data, use the search bar above to search for your test kit');
  
  });

  it('should display id and shipping columns after populating search results', () => {
    cy.addSample();
    cy.successModalTrue();
    cy.get('.MuiTableHead-root')
      .should('exist')
      .and('contains.text', 'Label Id')
      .and('contains.text', 'Shipping Tracking Code');
  
  });
  
});


describe('Common Scenarios', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('mainUrl'));

  });

  it('does exact search for random known id and confirms correct formatting', () => {
      
    cy.sampleByDataJson().then((sample) => 
        cy.addSampleBySearch(sample)
    );
    cy.successModalTrue();
    cy.resultsTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
  
  });

  it('does exact search for multiple random known ids and confirms correct formatting', () => {
    //this can be modified to change the number of label ids we want to grab or even update it to always run through the entire list.
    for (let i = 0; i < 5; i++) {
      cy.sampleByDataJson().then((sample) => 
        cy.addSampleBySearch(sample)
      );
    }
    cy.successModalTrue();
    cy.resultsTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
  
  });

  it('successfully populates a single kit id', () => {
    cy.addSample();
    cy.successModalTrue();
    cy.resultsTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
  
  });

  it('successfully populates multiple kit ids', () => {
    //pass in however many we want to populate here.
    cy.addSample(5);
    cy.successModalTrue();
    cy.resultsTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
  
  });

  it('does partial search for known and existing kit id', () => {
    cy.addSampleBySearch('007')
    cy.successModalTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
   
  });

  it('does partial search for multiple known and existing kit ids', () => {
    cy.addSampleBySearch('007')
    cy.successModalTrue()
    cy.addSampleBySearch('008')
    cy.successModalTrue();
    cy.regexLabelId();
    cy.regexTrackingId();
 
  });

  it('dismiss modal after approximately 7 seconds', () => {
    cy.addSample();
    cy.successModalTrue();

    cy.get('.Toastify__toast-container').should('exist')
      //normally try to avoid waits with cypress, but the goal here was just to make sure modals will always remain visible for at least 7 seconds.
      .wait(7000)
      .should('not.exist');
    
  });

  it('dimiss modal when user closes manually', () => {
    cy.addSample();
    cy.successModalTrue();

    cy.get('.Toastify__toast-container').should('exist')
    cy.get('.Toastify__close-button').click()
    cy.get('.Toastify__toast-container').should('not.exist');
    
  });

  it('clear button removes all previous results', () => {
    cy.addSample(5);
    cy.successModalTrue();
    cy.addSampleBySearch('007');
    cy.resultsTrue();

    cy.get('.MuiButtonBase-root').click()
    cy.get('.results-container').should('not.exist');
  
  });
  
});


describe('Exercise API directly', () => {

  it('gets an API response from shipping_data label_id', () => {
    const labelId = '22-252-1407'
    cy.request(Cypress.env('apiUrl') + '/shipping_data?label_id=' + labelId).as('apiReq') 
    cy.get('@apiReq').then(
      (response) => {
        expect(response.status).to.eq(200)
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('label_id', labelId)
        expect(response.body[0]).to.have.property('shipping_tracking_code');
      })
  });
  
});


describe('Error Scenarios', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('mainUrl'));

  });

  it('displays error modal for no results found', () => {
    cy.get('#mui-2').type('foo').type('{enter}')
    cy.errorModalTrue();
  
  });

  it('displays error modal when clicking search button without criteria', () => {
    //was expecting there to be more built in elements that used the data-testid attribute, but discovered there weren't many as it stands.
    //ideally we could add more of these data-testid attributes to help with maintenance.
    cy.getBySel('SearchIcon').click()
    cy.errorModalTrue();
  
  });

  it('should generate and search for common bad strings', () => {
    //this can be modified to change the number of bad strings we want to try here or even update it to always run through the entire list.
    for (let i = 0; i < 5; i++) {
      cy.badString().then((ns) => 
        cy.addSampleBySearch(ns)
      );
    }
  });

  it('checks for common injections', () => {
    //arbitrarily picked a few common injection tests using different quote characters.
    cy.get('#mui-2').type(`‘ or 1=1;–`).type('{enter}')
    cy.errorModalTrue();
    cy.get('#mui-2').clear()
    cy.get('#mui-2').type(`“ or 1=1;–`).type('{enter}')
    cy.errorModalTrue();
    cy.get('#mui-2').clear()
    cy.get('#mui-2').type(`‘ or ‘abc‘=‘abc‘;–`).type('{enter}')
    cy.errorModalTrue();
    cy.get('#mui-2').clear()
    cy.get('#mui-2').type(`‘ or ‘ ‘=‘ ‘;–`).type('{enter}')
    cy.errorModalTrue();
    cy.get('#mui-2').clear()
  
  });
  
});

