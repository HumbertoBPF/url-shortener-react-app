import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteUrl, getUser } from 'api/urlShortener';
import { AxiosError } from 'axios';
import Menu from 'components/Menu';
import Cookies from 'js-cookie';
import Home from 'pages/Home';
import { Route } from 'react-router-dom';
import { assertUrlItem } from 'utils/assertions';
import { mockUser, renderWithProviders } from 'utils/tests';

const user = mockUser();

const url0 = user.urls[0];
const url1 = user.urls[1];
const url2 = user.urls[2];

const routes = (
    <Route path="/" element={<Menu />}>
        <Route path="/home" element={<Home />} />
    </Route>
);

jest.mock('api/urlShortener', () => ({
    getUser: jest.fn(),
    deleteUrl: jest.fn(),
}));

beforeEach(() => {
    Cookies.set('token', 'token');
    (getUser as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: user })
    );
});

it('should display list of URLs of the authenticated user', async () => {
    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/home'],
            preloadedState: {
                user,
            },
        });
    });

    const myUrlsMenuItem = screen.getByTestId('my-urls-menu-item');
    await userEvent.click(myUrlsMenuItem);

    assertUrlItem(url0);
    assertUrlItem(url1);
    assertUrlItem(url2);
});

it('should delete URL', async () => {
    (deleteUrl as jest.Mock).mockImplementation(() =>
        Promise.resolve({ data: undefined })
    );

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/home'],
            preloadedState: {
                user,
            },
        });
    });

    const myUrlsMenuItem = screen.getByTestId('my-urls-menu-item');
    await userEvent.click(myUrlsMenuItem);

    const urlItem0 = screen.getByTestId(`url-item-${url0.id}`);
    const deleteButton = within(urlItem0).getByTestId('delete-button');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByTestId('confirm-button');
    await userEvent.click(confirmButton);

    expect(deleteUrl).toHaveBeenCalledTimes(1);
    expect(deleteUrl).toHaveBeenCalledWith(url0.id);
});

it('should display snackbar when DELETE /urls/:id returns error', async () => {
    (deleteUrl as jest.Mock).mockRejectedValue(new AxiosError());

    await act(async () => {
        renderWithProviders(routes, {
            initialEntries: ['/home'],
            preloadedState: {
                user,
            },
        });
    });

    const myUrlsMenuItem = screen.getByTestId('my-urls-menu-item');
    await userEvent.click(myUrlsMenuItem);

    const urlItem0 = screen.getByTestId(`url-item-${url0.id}`);
    const deleteButton = within(urlItem0).getByTestId('delete-button');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByTestId('confirm-button');
    await userEvent.click(confirmButton);

    const snackbar = screen.getByTestId('snackbar');
    expect(snackbar).toBeInTheDocument();
    expect(snackbar).toHaveTextContent('Error when deleting shortened URL');
});
