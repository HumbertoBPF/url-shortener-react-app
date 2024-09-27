import { Box, Button, TextField, Typography } from '@mui/material';
import { shorten } from 'api/urlShortener';
import Snackbar from 'components/Snackbar';
import { setUser } from 'features/userSlice';
import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import { FormEvent, useState } from 'react';

function ShortenUrlForm() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const [errors, setErrors] = useState(new Map());

    const [message, setMessage] = useState<ISnackbarMessage>({
        open: false,
        text: '',
        variant: 'success',
    });

    const resetForm = () => {
        setLongUrl('');
        setShortUrl('');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = new Map();

        if (!longUrl.trim()) {
            errors.set('longUrl', 'The URL field is required.');
        }

        setErrors(errors);

        if (errors.size > 0) {
            return;
        }

        shorten({ long_url: longUrl })
            .then((response) => {
                const { data } = response;
                setShortUrl(
                    `${process.env.REACT_APP_MUSICBOXD_API}/redirect/${data.short_url}`
                );
                dispatch(
                    setUser({
                        ...user,
                        urls: [...user.urls, data],
                    })
                );
            })
            .catch(() => {
                setMessage({
                    open: true,
                    text: 'Error when shortening URL',
                    variant: 'error',
                });
            });
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    p: '16px',
                }}
            >
                <Typography mb="8px">Shorten a long URL</Typography>
                <TextField
                    fullWidth
                    label="Long link"
                    onChange={(event) => setLongUrl(event.target.value)}
                    value={longUrl}
                    error={errors.has('longUrl')}
                    helperText={errors.get('longUrl')}
                />
                {shortUrl !== '' ? (
                    <>
                        <Typography my="8px">Tiny URL</Typography>
                        <TextField disabled fullWidth value={shortUrl} />
                        <Box sx={{ mt: '16px' }}>
                            <Button
                                color="info"
                                onClick={() =>
                                    window.open(shortUrl, '_blank')?.focus()
                                }
                                variant="contained"
                            >
                                Visit URL
                            </Button>
                            <Button
                                sx={{ ml: '16px' }}
                                color="success"
                                onClick={() =>
                                    navigator.clipboard.writeText(shortUrl)
                                }
                                variant="contained"
                            >
                                Copy
                            </Button>
                        </Box>
                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: '16px' }}
                            color="success"
                            onClick={resetForm}
                            variant="contained"
                        >
                            Shorten another
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            color="success"
                            fullWidth
                            sx={{ mt: '32px' }}
                            type="submit"
                            variant="contained"
                        >
                            Shorten URL
                        </Button>
                    </>
                )}
            </Box>
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

export default ShortenUrlForm;
