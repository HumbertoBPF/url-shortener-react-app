import { fakerEN_US as faker } from '@faker-js/faker';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUser, login } from 'api/urlShortener';
import Menu from 'components/Menu';
import Index from 'pages/Index';
import { Route } from 'react-router-dom';
import { mockUser, renderWithProviders } from 'utils/tests';

const email = faker.internet.email();
const password = 'Str0ng-P@ssw0rd';

const routes = (
    <Route path="/" element={<Menu />}>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<h1 data-testid="home">Home</h1>} />
    </Route>
);

jest.mock('api/urlShortener', () => ({
    login: jest.fn(),
    getUser: jest.fn(),
}));

it('should submit login form', async () => {
    (login as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            data: {
                token: 'token',
            },
        })
    );

    (getUser as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            data: mockUser(),
        })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/'],
        });
    });

    const signinMenuItem = screen.getByTestId('signin-menu-item');
    await userEvent.click(signinMenuItem);

    const emailInput = screen.getByTestId('email-input');
    await userEvent.type(emailInput, email);

    const passwordInput = screen.getByTestId('password-input');
    await userEvent.type(passwordInput, password);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({
        email,
        password,
    });

    expect(getUser).toHaveBeenCalledTimes(2);

    const home = screen.getByTestId('home');
    expect(home).toBeInTheDocument();
});

describe('error handling', () => {
    it('should display snackbar when /login returns an error', async () => {
        (login as jest.Mock).mockImplementation(() => {
            return Promise.reject(new Error());
        });

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signinMenuItem = screen.getByTestId('signin-menu-item');
        await userEvent.click(signinMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(login).toHaveBeenCalledTimes(1);
        expect(login).toHaveBeenCalledWith({
            email,
            password,
        });

        expect(getUser).toHaveBeenCalledTimes(0);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Invalid credentials');
    });

    it('should display snackbar when /user returns an error', async () => {
        (login as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                data: {
                    token: 'token',
                },
            })
        );

        (getUser as jest.Mock).mockImplementation(() => {
            return Promise.reject(new Error());
        });

        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/'],
            });
        });

        const signinMenuItem = screen.getByTestId('signin-menu-item');
        await userEvent.click(signinMenuItem);

        const emailInput = screen.getByTestId('email-input');
        await userEvent.type(emailInput, email);

        const passwordInput = screen.getByTestId('password-input');
        await userEvent.type(passwordInput, password);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        expect(login).toHaveBeenCalledTimes(1);
        expect(login).toHaveBeenCalledWith({
            email,
            password,
        });

        expect(getUser).toHaveBeenCalledTimes(1);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Error when fetching user data');
    });
});
