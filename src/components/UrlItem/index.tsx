import {
    Button,
    Card,
    CardActions,
    CardContent,
    Popover,
    Typography,
} from '@mui/material';
import { deleteUrl } from 'api/urlShortener';
import ConfirmDeletionDialog from 'components/ConfirmDeletionDialog';
import Snackbar from 'components/Snackbar';
import { setUser } from 'features/userSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import IUrl from 'interfaces/IUrl';
import { MouseEvent, useState } from 'react';

interface UrlItemProps {
    urlRecord: IUrl;
}

function UrlItem({ urlRecord }: UrlItemProps) {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [openPopover, setOpenPopover] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [message, setMessage] = useState<ISnackbarMessage>({
        open: false,
        text: '',
        variant: 'success',
    });

    const shortUrl = `${process.env.REACT_APP_URL_SHORTENER_API}/redirect/${urlRecord.short_url}`;

    const handleCopyUrl = (event: MouseEvent<HTMLButtonElement>) => {
        navigator.clipboard.writeText(shortUrl);
        setOpenPopover(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(false);
        setAnchorEl(null);
    };

    const handleDeleteUrl = () => {
        deleteUrl(urlRecord.id)
            .then(() => {
                dispatch(
                    setUser({
                        ...user,
                        urls: user.urls.filter(
                            (url) => url.id !== urlRecord.id
                        ),
                    })
                );
            })
            .catch(() => {
                setMessage({
                    open: true,
                    text: 'Error when deleting shortened URL',
                    variant: 'error',
                });
            });
    };

    return (
        <>
            <Card
                sx={{ margin: '8px 0px 0px 0px', p: '8px' }}
                variant="outlined"
                data-testid={`url-item-${urlRecord.id}`}
            >
                <CardContent>
                    <Typography
                        fontWeight="bold"
                        variant="body1"
                        data-testid="short-url"
                    >
                        {shortUrl}
                    </Typography>
                    <Typography
                        color="success"
                        variant="body2"
                        data-testid="long-url"
                    >
                        {urlRecord.long_url}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        color="info"
                        onClick={() => window.open(shortUrl, '_blank')?.focus()}
                        size="small"
                        variant="contained"
                        data-testid="visit-url-button"
                    >
                        Visit URL
                    </Button>
                    <Button
                        color="success"
                        onClick={handleCopyUrl}
                        size="small"
                        variant="contained"
                        data-testid="copy-button"
                    >
                        Copy
                    </Button>
                    <Popover
                        id={String(urlRecord.id)}
                        open={openPopover}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Typography color="success" sx={{ p: '4px' }}>
                            Copied!
                        </Typography>
                    </Popover>
                    <Button
                        color="error"
                        size="small"
                        onClick={() => setOpenDialog(true)}
                        variant="contained"
                        data-testid="delete-button"
                    >
                        Delete
                    </Button>
                </CardActions>
            </Card>
            <ConfirmDeletionDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleDeleteUrl}
            />
            <Snackbar
                message={message.text}
                open={message.open}
                onClose={() =>
                    setMessage({
                        ...message,
                        open: false,
                    })
                }
                variant={message.variant}
            />
        </>
    );
}

export default UrlItem;
