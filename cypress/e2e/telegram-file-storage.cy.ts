export default describe('Telegram app test', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('http://localhost:3000/')

    cy.get('[data-testid="loginEmail"]').type(Cypress.env('login'))
    cy.get('[data-testid="loginPassword"]').type(Cypress.env('password'))
    cy.get('[data-testid="loginSubmit"]').click()

    cy.get('[data-testid="chatInput"]').type(Cypress.env('chatId'))
    cy.get('[data-testid="chatSubmit"]').click()

    cy.get('[data-testid="homeLink"]').click()
  })

  describe('Files actions', () => {
    it('add and remove files', () => {
      const fileNames = ['1.png', '2.png', '3.png']
      fileNames.forEach((file) => {
        cy.get('[data-testid="fileUploader"]').attachFile(file)
        cy.get(`[data-testid="fileName"]:contains(${file})`).should(
          'have.length',
          1
        )
      })
      fileNames.forEach((file) => {
        cy.get(`[data-testid="fileName"]:contains(${file})`)
          .parents('[data-testid="fileItem"]')
          .within(() => {
            cy.intercept('http://localhost:3000/api/*').as('api')
            cy.get('[data-testid="deteleFile"]').click()
            cy.wait('@api')
          })
        cy.get(`[data-testid="fileName"]:contains(${file})`).should(
          'have.length',
          0
        )
      })
    })
    it('rename file', () => {
      const initFile = '1.png'
      const extension = initFile.split('.').reverse()[0]
      const newFileName = 'Test_' + Math.random()
      cy.get('[data-testid="fileUploader"]').attachFile(initFile)
      cy.get(`[data-testid="fileName"]:contains(${initFile})`)
        .parents('[data-testid="fileItem"]')
        .within(() => {
          cy.get('[data-testid="renameFile"]').click()
        })
      cy.get('[data-testid="newFileNameInput"]').clear().type(newFileName)
      cy.intercept('http://localhost:3000/api/*').as('api')
      cy.get('[data-testid="newFileNameSubmit"]').click()
      cy.wait('@api').then(() => {
        cy.get(`[data-testid="fileName"]:contains(${newFileName}.${extension})`)
          .should('have.length', 1)
          .parents('[data-testid="fileItem"]')
          .within(() => {
            cy.get('[data-testid="deteleFile"]').click()
            cy.wait('@api')
          })
      })
      cy.get(
        `[data-testid="fileName"]:contains(${newFileName}.${extension})`
      ).should('have.length', 0)
    })
  })

  describe('Folders actions', () => {
    it('add and delete folder', () => {
      const newFolderName = 'Test_' + Math.random()
      cy.get('[data-testid="addFolderInput"]').type(newFolderName)
      cy.get('[data-testid="addFolderSubmit"]').click()
      cy.get(`[data-testid="folderName"]:contains(${newFolderName})`)
        .should('have.length', 1)
        .parents('[data-testid="FolderItem"]')
        .within(() => {
          cy.get('[data-testid="deleteFolderButton"]').click()
        })
      cy.get('[data-testid="confirmYesAction"]').click()
      cy.get(`[data-testid="folderName"]:contains(${newFolderName})`).should(
        'have.length',
        0
      )
    })
    it('rename folder', () => {
      const newFolderName = 'Test_' + Math.random()
      const renameFolderName = 'TestRenamed_' + Math.random()
      cy.get('[data-testid="addFolderInput"]').type(newFolderName)
      cy.get('[data-testid="addFolderSubmit"]').click()
      cy.get(`[data-testid="folderName"]:contains(${newFolderName})`)
        .should('have.length', 1)
        .parents('[data-testid="FolderItem"]')
        .within(() => {
          cy.get('[data-testid="folderRenameButton"]').click()
        })
      cy.get('[data-testid="folderRenameInput"]').clear().type(renameFolderName)
      cy.get('[data-testid="folderRenameSubmit"]').click()
      cy.get(`[data-testid="folderName"]:contains(${newFolderName})`).should(
        'have.length',
        0
      )
      cy.get(`[data-testid="folderName"]:contains(${renameFolderName})`)
        .should('have.length', 1)
        .parents('[data-testid="FolderItem"]')
        .within(() => {
          cy.get('[data-testid="deleteFolderButton"]').click()
        })
      cy.get('[data-testid="confirmYesAction"]').click()
      cy.get(`[data-testid="folderName"]:contains(${renameFolderName})`).should(
        'have.length',
        0
      )
    })
  })

  describe('Bulk operation', () => {
    it('Remove bulk files and folders', () => {
      const files = ['1.png', '2.png', '3.png']
      const folders = [
        `Fodler_${Math.random()}`,
        `Fodler_${Math.random()}`,
        `Fodler_${Math.random()}`,
      ]

      files.forEach((file) => {
        cy.get('[data-testid="fileUploader"]').attachFile(file)
        cy.get(`[data-testid="fileName"]:contains(${file})`).should(
          'have.length',
          1
        )
      })
      folders.forEach((folder) => {
        cy.get('[data-testid="addFolderInput"]').type(folder)
        cy.get('[data-testid="addFolderSubmit"]').click()
        cy.get(`[data-testid="folderName"]:contains(${folder})`).should(
          'have.length',
          1
        )
      })

      cy.get('[data-testid="bulkSelectButton"]').click()
      cy.get('[data-testid="fileSelectCheckbox"]').click({ multiple: true })
      cy.get('[data-testid="folderSelectCheckbox"]').click({
        multiple: true,
      })

      cy.get('[data-testid="bulkDeleteButton"]').click()

      cy.get('[data-testid="FolderItem"]').should('have.length', 0)
      cy.get('[data-testid="fileItem"]').should('have.length', 0)
    })

    it('Move bulk files and folders', () => {
      const file = '1.png'
      const folder = `Fodler_${Math.random()}`

      cy.get('[data-testid="fileUploader"]').attachFile(file)

      cy.get('[data-testid="addFolderInput"]').type(folder)
      cy.get('[data-testid="addFolderSubmit"]').click()

      cy.get('[data-testid="bulkSelectButton"]').click()
      cy.get('[data-testid="fileSelectCheckbox"]').click({ multiple: true })
      cy.get('[data-testid="folderSelectCheckbox"]').click({
        multiple: true,
      })

      cy.get('[data-testid="bulkMoveButton"]').click()

      cy.intercept('http://localhost:3000/api/*').as('api')

      cy.get('[data-testid="bulkMoveModal"]').within(() => {
        cy.get('[data-testid="UserUploadFolder"]').click()
        cy.get('[data-testid="bulkMoveSubmit"]').click()
      })

      cy.wait('@api')

      cy.get('[data-testid="goToMainButton"]').click()
      cy.get(`[data-testid="fileName"]:contains(${file})`).should(
        'have.length',
        0
      )
      cy.get(`[data-testid="folderName"]:contains(${folder})`).should(
        'have.length',
        0
      )

      cy.get('[data-testid="UserUploadFolder"]').click()
      cy.get(`[data-testid="fileName"]:contains(${file})`).should(
        'have.length',
        1
      )
      cy.get(`[data-testid="folderName"]:contains(${folder})`).should(
        'have.length',
        1
      )

      cy.get('[data-testid="bulkSelectButton"]').click()
      cy.get('[data-testid="fileSelectCheckbox"]').click({ multiple: true })
      cy.get('[data-testid="folderSelectCheckbox"]').click({
        multiple: true,
      })

      cy.get('[data-testid="bulkDeleteButton"]').click()

      cy.wait('@api').then(() => {
        cy.get('[data-testid="FolderItem"]').should('have.length', 0)
        cy.get('[data-testid="fileItem"]').should('have.length', 0)
      })
    })
  })
})
