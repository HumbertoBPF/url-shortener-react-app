import { fakerEN_US as faker } from '@faker-js/faker';
import { mockUrl, mockUser } from '../../src/utils/mocks';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

const user = mockUser();
const url = mockUrl();

beforeEach(() => {
    cy.intercept('POST', '/login', {
        statusCode: 200,
        body: {
            token: 'token',
        },
    });

    cy.intercept('GET', '/user', {
        statusCode: 200,
        body: user,
    });

    cy.intercept('POST', '/shorten', {
        statusCode: 200,
        body: url,
    });
});

it('should shorten URL', () => {
    cy.login(email, password);

    cy.getByTestId('long-url-input').type(url.long_url);

    cy.getByTestId('submit-button').click();

    cy.getByTestId('short-url-input')
        .should('have.value', `http://localhost:5000/redirect/${url.short_url}`)
        .and('be.disabled');
});
