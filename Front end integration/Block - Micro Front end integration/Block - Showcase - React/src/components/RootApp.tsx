import * as React from 'react';
import { hot } from 'react-hot-loader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '@core/routes/Routes';
import { Provider } from 'react-redux';
import { store } from '@core/store/store';
import { AuthProvider } from '@core/context/authProvider';

const theme = createMuiTheme({
    spacing: 1,
    palette: {
        type: 'light',
        primary: {
            main: '#00b2f4',
            contrastText: '#f5f5f5',
        },
        secondary: {
            main: '#29f2a1',
            contrastText: '#f5f5f5',
        },
    },
});

class RootApp extends React.Component<Record<string, unknown>, undefined> {
    public render() {
        return (
            <React.Fragment>
                <AuthProvider>
                    <Provider store={store}>
                        <MuiThemeProvider theme={theme}>
                            <CssBaseline />
                            <Routes />
                        </MuiThemeProvider>
                    </Provider>
                </AuthProvider>
            </React.Fragment>
        );
    }
}
declare let module: Record<string, unknown>;

export default hot(module)(RootApp);
