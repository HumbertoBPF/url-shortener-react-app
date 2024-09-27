import { Box, Typography } from '@mui/material';

function ProjectPresentation() {
    return (
        <Box color="white" maxWidth="575px" p="16px">
            <Typography variant="h5">Design a URL Shortener</Typography>
            <Typography mt="8px">
                This is an implementation for the URL Shortener system design
                problem described in the book The System Design Interview - An
                Insider&apos;s Guide by Alex Xu.
            </Typography>
        </Box>
    );
}

export default ProjectPresentation;
