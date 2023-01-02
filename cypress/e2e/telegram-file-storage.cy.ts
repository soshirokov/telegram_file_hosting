export default describe('example to-do app', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('http://localhost:3000/')

    cy.get('[data-testid="loginEmail"]').type(Cypress.env('login'))
    cy.get('[data-testid="loginPassword"]').type(Cypress.env('password'))
    cy.get('[data-testid="loginSubmit"]').click()

    cy.get('[data-testid="chatInput"]').type('188905703')
    cy.get('[data-testid="chatSubmit"]').click()

    cy.get('[data-testId="homeLink"]').click()
  })

  afterEach(() => {
    cy.intercept('http://localhost:3000/api/*').as('api')

    cy.get('[data-testId="deteleFile"]').click({ multiple: true })

    cy.wait('@api').then(() => {
      cy.get('[data-testid="fileItem"]').should('have.length', 0)
    })
  })

  it('add files', () => {
    cy.get('[data-testid="fileUploader"]').attachFile('1.png')
    cy.get('[data-testid="fileUploader"]').attachFile('2.png')
    cy.get('[data-testid="fileUploader"]').attachFile('3.png')

    cy.get('[data-testid="fileItem"]').should('have.length', 3)
  })

  it('rename file', () => {
    const initFile = '1.png'
    const extension = initFile.split('.').reverse()[0]
    const newFileName = 'Test'

    cy.get('[data-testid="fileUploader"]').attachFile(initFile)

    cy.get('[data-testId="renameFile"]').click()

    cy.get('[data-testId="newFileNameInput"]').clear().type(newFileName)

    cy.intercept('http://localhost:3000/api/*').as('api')

    cy.get('[data-testId="newFileNameSubmit"]').click()

    cy.wait('@api').then(() => {
      cy.get('[data-testId="fileName"]').should(
        'have.text',
        `${newFileName}.${extension}`
      )
    })
  })
})
