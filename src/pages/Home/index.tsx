import { Grid2 } from '@mui/material';
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
        <Grid2 container>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <ShortenUrlForm />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <ProjectPresentation />
            </Grid2>
        </Grid2>
    );
}

export default Home;
