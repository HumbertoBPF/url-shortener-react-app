import { fakerEN_US as faker } from '@faker-js/faker';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

beforeEach(() => {
    cy.intercept('POST', '/signup', {
        statusCode: 201,
    });
});

it('should create account', () => {
    cy.visit('/');

    cy.getByTestId('signup-menu-button').click();

    cy.getByTestId('email-input').type(email);
    cy.getByTestId('password-input').type(password);

    cy.getByTestId('submit-button').click();

    cy.getByTestId('snackbar').should(
        'have.text',
        'Account successfully created'
    );
});
