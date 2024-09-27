import { Box } from '@mui/material';
import ProjectPresentation from 'components/ProjectPresentation';
import ShortenUrlForm from 'components/ShortenUrlForm';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');

        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <Box display="flex">
            <ShortenUrlForm />
            <ProjectPresentation />
        </Box>
    );
}

export default Home;
