import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from '@mui/material';
import { getUser, login } from 'api/urlShortener';
import useAppDispatch from 'hooks/useAppDispatch';
import Cookies from 'js-cookie';
import { FormEvent, useState } from 'react';
import { setUser } from 'features/userSlice';
import { useNavigate } from 'react-router-dom';
import Snackbar from 'components/Snackbar';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';

interface LoginFormProps {
    onSuccess: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [message, setMessage] = useState<ISnackbarMessage>({
        open: false,
        text: '',
        variant: 'success',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const fetchUser = () => {
        getUser()
            .then((response) => {
                const { data } = response;
                dispatch(setUser(data));
                navigate('/home');
            })
            .catch(() => {
                setMessage({
                    open: true,
                    text: 'Error when fetching user data',
                    variant: 'error',
                });
            });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        login({
            email,
            password,
        })
            .then((response) => {
                const { data } = response;
                const { token } = data;
                Cookies.set('token', token);
                fetchUser();
                onSuccess();
            })
            .catch(() => {
                setMessage({
                    open: true,
                    text: 'Invalid credentials',
                    variant: 'error',
                });
            });
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography mb="16px" textAlign="center">
                    Welcome to URL Shortener
                </Typography>
                <TextField
                    fullWidth
                    label="Email"
                    sx={{ mb: '16px' }}
                    type="email"
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'email-input',
                        },
                    }}
                />
                <FormControl fullWidth sx={{ mb: '16px' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                        Password
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {isPasswordVisible ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        data-testid="password-input"
                        label="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                </FormControl>
                <Button
                    fullWidth
                    startIcon={<Login />}
                    type="submit"
                    variant="contained"
                    data-testid="submit-button"
                >
                    Sign In
                </Button>
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

export default LoginForm;
