import { Dialog, Portal, Text, Button, useTheme } from "react-native-paper";

const ErrorDialog = ({ error, onDismiss }) => {
    const theme = useTheme();
    return (
        <Portal>
            <Dialog visible={true} onDismiss={onDismiss} style={{ backgroundColor: theme.colors.errorContainer }}>
                <Dialog.Title>Error</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.error }}>{error}</Text>
                </Dialog.Content>
                <Dialog.Actions>

                    <Button onPress={onDismiss}>Back</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ErrorDialog;