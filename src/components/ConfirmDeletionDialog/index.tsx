import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDeletionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function ConfirmDeletionDialog({
    open,
    onClose,
    onConfirm,
}: ConfirmDeletionDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-deletion-dialog-title"
            aria-describedby="confirm-deletion-dialog-description"
        >
            <DialogTitle id="confirm-deletion-dialog-title">
                Delete URL record
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-deletion-dialog-description">
                    Once deleted, the URL record can no longer be recovered. Do
                    you want to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Decline</Button>
                <Button
                    onClick={onConfirm}
                    autoFocus
                    data-testid="confirm-button"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeletionDialog;
