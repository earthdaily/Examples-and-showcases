import React, { useEffect, useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
// @ts-ignore
import styled from 'styled-components';
import { loadRemoteModule } from '@core/mf-runtime/dynamic-federation';
import { createMuiTheme } from '@material-ui/core';

const BoundaryManagementPage = () => {
    const elementRef = React.useRef();

    const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');

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

    const getOptions = () => {
        const token_data = JSON.parse(
            sessionStorage.getItem(`oidc.user:${process.env.IDENTITY_SERVER_URL}:${process.env.IDENTITY_SERVER_CLIENT_ID}`),
        );
        return {
            g6Token: token_data?.access_token,
            locale: selectedLanguage,
            theme,
            snackbarConfig: {
                vertical: 'top',
                horizontal: 'right',
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
            },
        };
    };

    const loadMFE = async () => {
        // @ts-ignore
        if (elementRef.current.innerHTML.length === 0) {
            try {
                const module = await loadRemoteModule({
                    remoteName: process.env.MFE_BOUNDARY_MANAGEMENT_REMOTE_NAME,
                    exposedModule: process.env.MFE_BOUNDARY_MANAGEMENT_EXPOSED_MODULE,
                });
                console.table(module);
                await module.mount(elementRef.current, getOptions());
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const language = e.target.value as string;
        setSelectedLanguage(language);

        const event = new CustomEvent('MFE.BoundaryManagement.LocaleChanged', {
            detail: {
                locale: language,
            },
        });
        document.dispatchEvent(event);
    };

    useEffect(() => {
        loadMFE();
    }, [loadMFE]);

    return (
        <MuiThemeProvider theme={theme}>
            <Context>
                <h1>Boundary Management </h1>
                {/*<LanguageSelection>*/}
                {/*    <FormControl variant='outlined' size='small'>*/}
                {/*        <InputLabel id='label-language'>Select Language</InputLabel>*/}
                {/*        <CustomSelect*/}
                {/*            labelId='language-label-id'*/}
                {/*            id='languages-list'*/}
                {/*            variant='outlined'*/}
                {/*            label='Select Language'*/}
                {/*            value={selectedLanguage}*/}
                {/*            onChange={handleLanguageChange}*/}
                {/*            displayEmpty={true}*/}
                {/*        >*/}
                {/*            <MenuItem key='en' value='en-US'>*/}
                {/*                {'en-US'}*/}
                {/*            </MenuItem>*/}
                {/*            <MenuItem key='en' value='fr-FR'>*/}
                {/*                {'fr-FR'}*/}
                {/*            </MenuItem>*/}
                {/*        </CustomSelect>*/}
                {/*    </FormControl>*/}
                {/*</LanguageSelection>*/}
            </Context>

            <div id='boundary-management-mfe-id' ref={elementRef} />
        </MuiThemeProvider>
    );
};

const Context = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
`;

const LanguageSelection = styled.div`
    padding-left: 15px;
`;

export default BoundaryManagementPage;
