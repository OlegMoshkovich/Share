import {waitForModel, homepageSetup, setCookingAndVisitHome} from '../../support/utils'


describe('select-a-note', () => {
  context('Open index.ifc and notes', () => {
    beforeEach(() => {
      homepageSetup()
    })
    it('Github link is visible on a note card in the list', () => {
      setCookingAndVisitHome()
      waitForModel()
      cy.get('[data-testid="Notes"]').click()
      cy.get('[data-testid="Open in Github"]')
    })
    it('Github link is visible on a note card when the note selected', () => {
      cy.setCookie('isFirstTime', '1')
      cy.visit('/')
      waitForModel()
      cy.get('[data-testid="Notes"]').click()
      cy.get(':nth-child(1) > .MuiPaper-root > [data-testid="card-body"] > .MuiCardContent-root').contains('Test Issue body').click()
      cy.get('.MuiCardHeader-title').contains('Local issue 2')
      cy.get('[data-testid="Open in Github"]')
    })
  })
})
