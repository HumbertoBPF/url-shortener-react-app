import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from '@mui/material';
import { signup } from 'api/urlShortener';
import Snackbar from 'components/Snackbar';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import { FormEvent, useState } from 'react';
import { isValidEmail } from 'utils/validation';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [errors, setErrors] = useState(new Map());

    const [message, setMessage] = useState<ISnackbarMessage>({
        open: false,
        text: '',
        variant: 'success',
    });

    const handleClickShowPassword = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = new Map();

        if (!isValidEmail(email)) {
            errors.set('email', 'The email field is required');
        }

        if (!password) {
            errors.set('password', 'The password field is required');
        }

        setErrors(errors);

        if (errors.size > 0) {
            return;
        }

        signup({
            email,
            password,
        })
            .then(() => {
                setMessage({
                    open: true,
                    text: 'Account successfully created',
                    variant: 'success',
                });
            })
            .catch((error) => {
                const { response } = error;
                const { data } = response;

                if (Object.hasOwn(data, 'email')) {
                    setErrors(
                        new Map([['email', 'This email is not available']])
                    );
                    return;
                }

                setMessage({
                    open: true,
                    text: 'Error during account creation',
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
                    error={errors.has('email')}
                    helperText={errors.get('email')}
                />
                <FormControl
                    fullWidth
                    sx={{ mb: '16px' }}
                    variant="outlined"
                    error={errors.has('password')}
                >
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
                        label="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                    <FormHelperText>{errors.get('password')}</FormHelperText>
                </FormControl>
                <Button
                    fullWidth
                    startIcon={<Login />}
                    type="submit"
                    variant="contained"
                >
                    Sign Up
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

export default SignupForm;
