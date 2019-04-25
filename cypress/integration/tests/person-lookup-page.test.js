describe('Person lookup page', function () {
  beforeEach(function () {
    cy.fixture('persons/persons.json').as('persons')
  })

  it('has fields for filtering and sorting', function () {
    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('label[for="search"]').should('have.text', 'Search')
    cy.get('[data-cy="search"]')

    cy.get('label[for="office"]').should('have.text', 'Office')
    cy.get('[data-cy="office"]')
      .as('office')
      .find('.Select-value')
      .should('have.text', 'All')
    cy.get('@office')
      .find('.Select-control > .Select-arrow-zone ')
      .click()
    cy.get('@office')
      .find('.Select-menu-outer')
      .should('contain', 'All')
      // first office
      .and('contain', 'Dallas/Fort Worth District Office')
      // last office
      .and('contain', 'St. Louis District Office')

    cy.get('label[for="sort-by"]')
    cy.get('[data-cy="sort-by"]')
      .as('sortBy')
      .find('.Select-value')
      .should('have.text', 'Name A-Z')
    cy.get('@sortBy')
      .find('.Select-control > .Select-arrow-zone ')
      .click()
    cy.get('@sortBy')
      .get('.Select-menu-outer')
      .should('contain', 'Name A-Z')
      .and('contain', 'Name Z-A')

    cy.get('[data-cy="search button"]')
  })

  it('pushes query parameters to the url on search (without any selections)', function () {
    cy.visit('/person')

    cy.get('[data-cy="search button"]').click()

    cy.url()
      .should('contain', `pageNumber=1`)
      .should('contain', `pageSize=12`)
      .should('contain', `office=all`)
      .should('contain', `order=ascending`)
  })

  it(`displays 12 cards with person details by default`, function () {
    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('[data-cy="detail-card-collection-container"]')
      .should('have.length', 12)
  })

  it('opens the person detail page url when the person\'s name is clicked', function () {
    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('@persons').then(persons => {
      cy.get('[data-cy="detail-card"]')
        .first()
        .contains(persons[0].name)
        .click()

      cy.url().should('contain', `${persons[0].url}`)
    })
  })

  it('displays details about a person for a result', function () {
    const expectedName = 'Sabrina Abousaleh'
    const expectedTitle = 'Administrative Officer'
    const expectedOffice = 'Nevada District Office'
    const expectedPhone = '702-388-6683'
    const expectedEmail = 'sabrina.abousaleh@sba.gov'

    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('[data-cy="detail-card"]')
      .eq(2)
      .as('thirdCard')

    cy.get('@thirdCard').find('[data-cy="detail-card-title"]').should('have.text', expectedName)
    cy.get('@thirdCard').find('[data-cy="person title"]').should('have.text', expectedTitle)
    cy.get('@thirdCard').find('[data-cy="person office"]').should('have.text', expectedOffice)
    cy.get('@thirdCard').find('[data-cy="contact phone"]').should('have.text', expectedPhone)
    cy.get('@thirdCard').find('[data-cy="contact email"]').should('have.text', expectedEmail)
  })

  it('displays a message when no search results are found', function () {
    cy.server()
    cy.route('GET', '/api/content/search/persons.json', [])
    cy.visit('person')

    cy.get('[data-cy="no-results"]').should('exist')
  })

  it('searches and displays people with first and/or last names matching the search term', function () {
    const firstExpectedName = 'Gary Alexander'
    const secondExpectedName = 'Alex Kohls'

    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('[data-cy="search"]').type('alex')
    cy.get('[data-cy="search button"]').click()

    cy.get('[data-cy="detail-card"]').as('detailCards')

    cy.get('@detailCards')
      .first()
      .should('contain', firstExpectedName)

    cy.get('@detailCards')
      .eq(1)
      .find('[data-cy="detail-card-title"]')
      .should('contain', secondExpectedName)
  })

  it('searches and displays people with offices matching the search term', function () {
    const expectedOffice = 'St. Louis District Office'

    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('[data-cy="search"]').type('louis')
    cy.get('[data-cy="search button"]').click()

    cy.get('[data-cy="detail-card"]').as('detailCards')
      .first()
      .should('contain', expectedOffice)
  })

  it('filters people by office name when an office name is selected', function () {
    const expectedCount = 2

    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('[data-cy="office"]')
      .as('office')
      // Grab text input from React-Select dropdown
      .find('.Select-input > input')
      // React-Select covers the input with a <span> to hide it, so Cypress
      // doesn't type unless we force it to
      .type('Pittsburgh District Office', { force: true })

    // Select first option that should be labelled "Pittsburgh District Office"
    cy.get('@office')
      .find('.Select-option')
      .click()

    cy.get('[data-cy="search button"]').click()

    cy.get('[data-cy="detail-card"]').as('detailCards')
      .should('have.length', expectedCount)
  })

  it('displays people in descending last name order when Name Z-A is selected', function () {
    cy.server()
    cy.route('GET', '/api/content/search/persons.json', '@persons')

    cy.visit('/person')

    cy.get('@persons').then(persons => {
      const firstPersonName = persons[0].name
      const lastPersonName = persons[persons.length - 1].name

      cy.get('[data-cy="detail-card"]')
        .first()
        .as('firstCard')

      cy.get('@firstCard').should('contain', firstPersonName)

      // Click arrow in React-Select dropdown to show options
      cy.get('[data-cy="sort-by"]')
        .as('sortBy')
        .find('.Select-arrow-zone')
        .click()

      // Select second option (Name Z-A)
      cy.get('@sortBy')
        .find('.Select-option')
        .eq(1)
        .click()

      cy.get('[data-cy="search button"]').click()

      cy.get('@firstCard').should('contain', lastPersonName)
    })
  })
})
