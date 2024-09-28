import { fakerEN_US as faker } from '@faker-js/faker';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signup } from 'api/urlShortener';
import { AxiosError, AxiosHeaders } from 'axios';
import Menu from 'components/Menu';
import Index from 'pages/Index';
import { Route } from 'react-router-dom';
import { renderWithProviders } from 'utils/tests';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

const routes = (
    <Route path="/" element={<Menu />}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<h1 data-testid="home">Home</h1>} />
    </Route>
);

jest.mock('api/urlShortener', () => ({
    signup: jest.fn(),
}));

it('should create account', async () => {
    (signup as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: undefined })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/'],
        });
    });

    const signupMenuItem = screen.getByTestId('signup-menu-item');
    await userEvent.click(signupMenuItem);

    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, email);

    const passwordInput = screen.getByTestId('password-input');
    await userEvent.type(passwordInput, password);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(signup).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledWith({
        email,
        password,
    });
});

describe('form validation', () => {
    it('should require an email address', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signupMenuItem = screen.getByTestId('signup-menu-item');
        await userEvent.click(signupMenuItem);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const emailError = screen.getByTestId('email-error');
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent(
            'It must be a valid email address'
        );
    });

    it('should require a valid email address', async () => {
        const firstName = faker.person.firstName();

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signupMenuItem = screen.getByTestId('signup-menu-item');
        await userEvent.click(signupMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, firstName);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const emailError = screen.getByTestId('email-error');
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent(
            'It must be a valid email address'
        );
    });

    it('should require a password', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signupMenuItem = screen.getByTestId('signup-menu-item');
        await userEvent.click(signupMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, email);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(signup).toHaveBeenCalledTimes(0);

        const passwordError = screen.getByTestId('password-error');
        expect(passwordError).toBeInTheDocument();
        expect(passwordError).toHaveTextContent(
            'The password field is required'
        );
    });
});

describe('error handling', () => {
    it('should display generic error returned by the /signup endpoint', async () => {
        (signup as jest.Mock).mockImplementation(() => {
            const error = new AxiosError();

            error.response = {
                data: {
                    error: 'Generic error',
                },
                status: 400,
                statusText: 'Bad Request',
                headers: new AxiosHeaders(),
                config: {
                    headers: new AxiosHeaders(),
                },
            };

            return Promise.reject(error);
        });

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signupMenuItem = screen.getByTestId('signup-menu-item');
        await userEvent.click(signupMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Error during account creation');
    });

    it('should display email error returned by the /signup endpoint', async () => {
        (signup as jest.Mock).mockImplementation(() => {
            const error = new AxiosError();

            error.response = {
                data: {
                    email: ['This field must be unique'],
                },
                status: 400,
                statusText: 'Bad Request',
                headers: new AxiosHeaders(),
                config: {
                    headers: new AxiosHeaders(),
                },
            };

            return Promise.reject(error);
        });

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signupMenuItem = screen.getByTestId('signup-menu-item');
        await userEvent.click(signupMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        const emailError = screen.getByTestId('email-error');
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveTextContent('This email is not available');
    });
});
