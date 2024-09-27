import './App.css';
import { createBrowserRouter } from 'react-router-dom';
import Menu from 'components/Menu';
import Index from 'pages/Index';
import Home from 'pages/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Menu />,
        children: [
            {
                path: '/',
                element: <Index />,
            },
            {
                path: '/home',
                element: <Home />,
            },
        ],
    },
]);

export default router;
