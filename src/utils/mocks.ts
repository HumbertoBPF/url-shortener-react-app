import { fakerEN_US as faker } from '@faker-js/faker';

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
