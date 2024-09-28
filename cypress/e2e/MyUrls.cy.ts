import { fakerEN_US as faker } from '@faker-js/faker';
import { mockUser } from '../../src/utils/mocks';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

const user = mockUser();
const { urls } = user;

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

    cy.intercept('DELETE', `/urls/${urls[0].id}`, {
        statusCode: 204,
    });
});

it('should list the URLs of the authenticated user and delete one', () => {
    cy.login(email, password);

    cy.getByTestId('my-urls-menu-button').click();

    cy.getByTestId(`url-item-${urls[0].id}`).should('be.visible');
    cy.getByTestId(`url-item-${urls[1].id}`).should('be.visible');
    cy.getByTestId(`url-item-${urls[2].id}`).should('be.visible');

    cy.getByTestId(`url-item-${urls[0].id}`)
        .findByTestId('delete-button')
        .click();

    cy.getByTestId('confirm-button').click();

    cy.getByTestId(`url-item-${urls[0].id}`).should('not.exist');
    cy.getByTestId(`url-item-${urls[1].id}`).should('be.visible');
    cy.getByTestId(`url-item-${urls[2].id}`).should('be.visible');
});
