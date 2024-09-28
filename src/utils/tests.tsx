import { PropsWithChildren, ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

import { AppStore, RootState, setupStore } from 'store';
import {
    createMemoryRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import { fakerEN_US as faker } from '@faker-js/faker';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    initialEntries?: string[];
    store?: AppStore;
}

export function renderWithProviders(
    ui: ReactElement,
    extendedRenderOptions: ExtendedRenderOptions = {}
) {
    const {
        preloadedState = {},
        initialEntries = [],
        store = setupStore(preloadedState),
        ...renderOptions
    } = extendedRenderOptions;

    const Wrapper = ({ children }: PropsWithChildren) => {
        const router = createMemoryRouter(createRoutesFromElements(children), {
            initialEntries,
        });

        return (
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        );
    };

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

export function mockUrl() {
    return {
        id: faker.number.int({ min: 1, max: 1000 }),
        long_url: faker.internet.url(),
        short_url: String(faker.number.int({ min: 1, max: 1000 })),
    };
}

export function mockUser() {
    return {
        email: faker.internet.email(),
        urls: [mockUrl(), mockUrl(), mockUrl()],
    };
}
