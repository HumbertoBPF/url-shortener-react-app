import { Box } from '@mui/material';
import UrlItem from 'components/UrlItem';
import useAppSelector from 'hooks/useAppSelector';

function MyUrls() {
    const user = useAppSelector((state) => state.user);

    return (
        <Box p="0px 8px 8px 8px">
            {user.urls.map((urlRecord) => (
                <UrlItem key={urlRecord.id} urlRecord={urlRecord} />
            ))}
        </Box>
    );
}

export default MyUrls;
