describe("Office Search", function() {
    it('Should display custom data with a mocked json request', function() {

        const mockResponse = 
        {
            found: 3,
            start: 1,
            hit: [
                {
                    id: '1',
                    fields: {
                        geolocation: ['38.884628,-77.016292'],
                        location_city: ['Washington'],
                        location_name: ['SBA Headquarters'],
                        location_phone_number: ['(202) 205-6780'],
                        location_state: ['DC'],
                        location_street_address: ['4091 3rd St SW,, Suite 5300'],
                        location_zipcode: ['20416'],
                        office_type: ['SBA Headquarters Office'],
                        summary: [
                            'The Office of Human Resources Solutions (OHRS) und…man Capital services to meet the dynamic needs of'
                        ],
                        title: ['Office of the Chief Human Capital Officer'],
                        type: ['office']
                    },
                    exprs: {
                        distance: '0.8088529979132633'
                    }
                },

                {
                    id: '2',
                    fields: {
                        geolocation: ['37.884628,-76.016292'],
                        location_city: ['Washington'],
                        location_name: ['SBA Headquarters'],
                        location_phone_number: ['(202) 205-6780'],
                        location_state: ['DC'],
                        location_street_address: ['4092 3rd St SW,, Suite 5300'],
                        location_zipcode: ['20416'],
                        office_type: ['SBA Headquarters Office'],
                        summary: [
                            'The Office of Human Resources Solutions (OHRS) und…man Capital services to meet the dynamic needs of'
                        ],
                        title: ['Office of the Chief Human Capital Officer - 1'],
                        type: ['office']
                    },
                    exprs: {
                        distance: '20.8088529979132633'
                    }
                },

                {
                    id: '3',
                    fields: {
                        geolocation: ['36.884628,-78.016292'],
                        location_city: ['Washington'],
                        location_name: ['SBA Headquarters'],
                        location_phone_number: ['(202) 205-6780'],
                        location_state: ['DC'],
                        location_street_address: ['4093 3rd St SW,, Suite 5300'],
                        location_zipcode: ['20416'],
                        office_type: ['SBA Headquarters Office'],
                        summary: [
                            'The Office of Human Resources Solutions (OHRS) und…man Capital services to meet the dynamic needs of'
                        ],
                        title: ['Office of the Chief Human Capital Officer - 2'],
                        type: ['office']
                    },
                    exprs: {
                        distance: '10.8088529979132633'
                    }
                }
            ]
        }

        cy.server()
        cy.route('GET', '/api/content/offices.json?pageSize=5&start=0&address=20024', mockResponse )
        cy.viewport(1300, 800)
        cy.visit('https://avery.ussba.io/office')
        cy.wait(1000)

    })
})