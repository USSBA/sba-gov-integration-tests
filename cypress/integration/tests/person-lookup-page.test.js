describe('Person lookup page', function () {
  const defaultOffice = 'all'
  const defaultOrder = 'ascending'
  const defaultPageNumber = 1
  const defaultPageSize = 12

  beforeEach(function () {
    cy.fixture('persons/persons.json').as('persons')
  })

  it('has fields for filtering and sorting', function () {
    // handle redirect without failing test
    cy.visit('/person', { failOnStatusCode: false })

    cy.get('label[for="search"]').should('have.text', 'Search')

    cy.get('label[for="office"]').should('have.text', 'Office')
    cy.get('[data-cy="office"]')
      .as('office')
      .find('.Select-value')
      .should('have.text', 'All')
    cy.get('@office')
      .click()
      .find('.Select-menu-outer')
      .should('contain', 'All')
      // first office
      .and('contain', 'Alabama District Office')
      // last office
      .and('contain', 'Wyoming District Office')

    cy.get('label[for="sort-by"]')
    cy.get('[data-cy="sort-by"]')
      .as('sortBy')
      .find('.Select-value')
      .should('have.text', 'Name A-Z')
    cy.get('@sortBy')
      .click()
      .find('.Select-menu-outer')
      .should('contain', 'Name A-Z')
      .and('contain', 'Name Z-A')

    cy.get('[data-cy="search button"]')
  })

  it('should push query parameters to the url on search (without any selections)', function () {
    cy.visit('/person', { failOnStatusCode: false })

    cy.get('[data-cy="search button"]').click()

    cy.url()
      .should('contain', `pageNumber=${defaultPageNumber}`)
      .should('contain', `pageSize=${defaultPageSize}`)
      .should('contain', `office=${defaultOffice}`)
      .should('contain', `order=${defaultOrder}`)
  })

  it(`displays ${defaultPageSize} cards with person details by default`, function () {
    cy.server()
    cy.route('GET', '/api/content/persons.json', '@persons')

    cy.visit('/person', { failOnStatusCode: false })

    cy.get('[class~=document-card-collection]')
      .find('[class~=card-container]')
      .should('have.length', defaultPageSize)
  })

  it('should open person detail page url when person name or "See bio" is clicked', function () {
    cy.server()
    cy.route('GET', '/api/content/persons.json', '@persons')

    cy.visit('/person', { failOnStatusCode: false })

    cy.get('[class~=detail-card]').eq(0).find('h6 > a').click()

    cy.get('@persons').then(persons => {
      cy.url().should('contain', `${persons[0].url}`)
    })
  })
})
