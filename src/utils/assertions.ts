import { screen, within } from '@testing-library/react';
import IUrl from 'interfaces/IUrl';

export function assertUrlItem(url: IUrl) {
    const urlRecord = screen.getByTestId(`url-item-${url.id}`);

    const shortUrl = within(urlRecord).getByTestId('short-url');
    expect(shortUrl).toBeInTheDocument();
    expect(shortUrl).toHaveTextContent(
        `${process.env.REACT_APP_MUSICBOXD_API}/redirect/${url.short_url}`
    );

    const longUrl = within(urlRecord).getByTestId('long-url');
    expect(longUrl).toBeInTheDocument();
    expect(longUrl).toHaveTextContent(url.long_url);

    const visitUrlButton = within(urlRecord).getByTestId('visit-url-button');
    expect(visitUrlButton).toBeInTheDocument();
    expect(visitUrlButton).toHaveTextContent('Visit URL');

    const copyButton = within(urlRecord).getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent('Copy');

    const deleteButton = within(urlRecord).getByTestId('delete-button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent('Delete');
}
