import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUser, shorten } from 'api/urlShortener';
import { AxiosError, AxiosHeaders } from 'axios';
import Menu from 'components/Menu';
import Cookies from 'js-cookie';
import Home from 'pages/Home';
import { Route } from 'react-router-dom';
import { mockUrl, mockUser, renderWithProviders } from 'utils/tests';

const user = mockUser();
const url = mockUrl();

const routes = (
    <Route path="/" element={<Menu />}>
        <Route path="/home" element={<Home />} />
    </Route>
);

jest.mock('api/urlShortener', () => ({
    getUser: jest.fn(),
    shorten: jest.fn(),
}));

beforeEach(() => {
    Cookies.set('token', 'token');
    (getUser as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: user })
    );
});

it('should shorten URL', async () => {
    (shorten as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: url })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/home'],
            preloadedState: {
                user,
            },
        });
    });

    const longUrlInput = screen.getByTestId('long-url-input');
    await userEvent.type(longUrlInput, url.long_url);

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(shorten).toHaveBeenCalledTimes(1);
    expect(shorten).toHaveBeenCalledWith({
        long_url: url.long_url,
    });

    const shortUrlInput = screen.getByTestId('short-url-input');
    expect(shortUrlInput).toBeInTheDocument();
    expect(shortUrlInput).toHaveValue(
        `${process.env.REACT_APP_MUSICBOXD_API}/redirect/${url.short_url}`
    );

    const visitUrlButton = screen.getByTestId('visit-url-button');
    expect(visitUrlButton).toBeInTheDocument();

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();

    const shortenAnotherButton = screen.getByTestId('shorten-another-button');
    expect(shortenAnotherButton).toBeInTheDocument();
});

describe('form validation', () => {
    it('should require long URL', async () => {
        await act(async () => {
            renderWithProviders(routes, {
                initialEntries: ['/home'],
                preloadedState: {
                    user,
                },
            });
        });

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        const longUrlError = screen.getByTestId('long-url-error');
        expect(longUrlError).toBeInTheDocument();
        expect(longUrlError).toHaveTextContent('The URL field is required');
    });
});

describe('error handling', () => {
    it('should display snackbar when /shorten returns an error', async () => {
        (shorten as jest.Mock).mockImplementation(() => {
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
                initialEntries: ['/home'],
                preloadedState: {
                    user,
                },
            });
        });

        const longUrlInput = screen.getByTestId('long-url-input');
        await userEvent.type(longUrlInput, url.long_url);

        const submitButton = screen.getByTestId('submit-button');
        await userEvent.click(submitButton);

        const snackbar = screen.getByTestId('snackbar');
        expect(snackbar).toBeInTheDocument();
        expect(snackbar).toHaveTextContent('Error when shortening URL');
    });
});
