import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LoginForm from 'components/LoginForm';
import SignupForm from 'components/SignupForm';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { clearUser, setUser } from 'features/userSlice';
import Cookies from 'js-cookie';
import { getUser } from 'api/urlShortener';
import MyUrls from 'components/MyUrls';
import ISnackbarMessage from 'interfaces/ISnackbarMessage';
import Snackbar from 'components/Snackbar';

enum DrawerContentType {
    DEFAULT = 'default',
    SIGNUP = 'signup',
    SIGNIN = 'signin',
    MY_URLS = 'myurls',
}

const drawerWidth = 480;

function Menu() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerContentType, setDrawerContentType] =
        useState<DrawerContentType>(DrawerContentType.DEFAULT);

    const [message, setMessage] = useState<ISnackbarMessage>({
        open: false,
        text: '',
        variant: 'success',
    });

    const isAuth = user.email !== '';

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            getUser()
                .then((response) => {
                    const { data } = response;
                    dispatch(setUser(data));
                })
                .catch(() => {
                    setMessage({
                        open: true,
                        text: 'Error when fetching user data',
                        variant: 'error',
                    });
                });
        }
    }, [dispatch, isAuth]);

    const handleDrawerToggle = () => {
        setDrawerOpen((prevState) => !prevState);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setDrawerContentType(DrawerContentType.DEFAULT);
    };

    const renderDrawerContent = () => {
        if (drawerContentType === DrawerContentType.MY_URLS) {
            return <MyUrls />;
        }

        if (drawerContentType === DrawerContentType.SIGNIN) {
            return (
                <Box padding="16px 8px 8px 8px">
                    <LoginForm
                        onSuccess={() => {
                            setDrawerOpen(false);
                            setDrawerContentType(DrawerContentType.DEFAULT);
                        }}
                    />
                    <Box display="flex" justifyContent="center" mt="8px">
                        <Typography display="inline">
                            Don&apos;t have an account?
                        </Typography>
                        <Typography
                            display="inline"
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                                setDrawerContentType(DrawerContentType.SIGNUP)
                            }
                        >
                            Sign Up
                        </Typography>
                    </Box>
                </Box>
            );
        }

        if (drawerContentType === DrawerContentType.SIGNUP) {
            return (
                <Box padding="16px 8px 8px 8px">
                    <SignupForm />
                    <Box display="flex" justifyContent="center" mt="8px">
                        <Typography display="inline">
                            Already a user?
                        </Typography>
                        <Typography
                            display="inline"
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                                setDrawerContentType(DrawerContentType.SIGNIN)
                            }
                        >
                            Log In
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                    URL Shortener
                </Typography>
                <Divider />
                <List>
                    {isAuth ? (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{ textAlign: 'center' }}
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.MY_URLS
                                        );
                                        handleDrawerToggle();
                                    }}
                                    data-testid="my-urls-menu-item"
                                >
                                    <ListItemText primary="My URLs" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{ textAlign: 'center' }}
                                    onClick={() => {
                                        Cookies.remove('token');
                                        dispatch(clearUser());
                                    }}
                                >
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{ textAlign: 'center' }}
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.SIGNUP
                                        );
                                        handleDrawerToggle();
                                    }}
                                    data-testid="signup-menu-item"
                                >
                                    <ListItemText primary="Sign Up" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{ textAlign: 'center' }}
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.SIGNIN
                                        );
                                        handleDrawerToggle();
                                    }}
                                    data-testid="signin-menu-item"
                                >
                                    <ListItemText primary="Sign In" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
        );
    };

    const container =
        window !== undefined ? () => window.document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        URL Shortener
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {isAuth ? (
                            <>
                                <Button
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.MY_URLS
                                        );
                                        handleDrawerToggle();
                                    }}
                                    color="inherit"
                                    data-testid="my-urls-menu-button"
                                >
                                    My URLs
                                </Button>
                                <Button
                                    onClick={() => {
                                        Cookies.remove('token');
                                        dispatch(clearUser());
                                    }}
                                    color="inherit"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.SIGNUP
                                        );
                                        handleDrawerToggle();
                                    }}
                                    color="inherit"
                                    data-testid="signup-menu-button"
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    onClick={() => {
                                        setDrawerContentType(
                                            DrawerContentType.SIGNIN
                                        );
                                        handleDrawerToggle();
                                    }}
                                    color="inherit"
                                    data-testid="signin-menu-button"
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box>
                <Drawer
                    anchor="right"
                    container={container}
                    variant="temporary"
                    open={drawerOpen}
                    onClose={handleCloseDrawer}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {renderDrawerContent()}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    background: 'linear-gradient(#002342, #10bde5)',
                    p: 3,
                    height: '100vh',
                    width: '100%',
                }}
            >
                <Toolbar />
                <Outlet />
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
            </Box>
        </Box>
    );
}

export default Menu;
