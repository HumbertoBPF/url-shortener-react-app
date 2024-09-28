import { fakerEN_US as faker } from '@faker-js/faker';
import { mockUser } from '../../src/utils/mocks';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

const user = mockUser();

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
});

it('should successfully log in', () => {
    cy.visit('/');

    cy.getByTestId('signin-menu-button').click();

    cy.getByTestId('email-input').type(email);
    cy.getByTestId('password-input').type(password);

    cy.getByTestId('submit-button').click();

    cy.url().should('contain', '/home');
});
