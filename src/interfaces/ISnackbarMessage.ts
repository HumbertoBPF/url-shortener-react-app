interface ISnackbarMessage {
    open: boolean;
    text: string;
    variant: 'success' | 'error';
}

export default ISnackbarMessage;
