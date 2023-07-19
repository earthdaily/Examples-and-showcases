import React, { FC, useState } from 'react';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';
import { useHistory } from 'react-router-dom';
import Oidc from 'oidc-client';

const AuthCallback: FC = (): JSX.Element => {
    const history = useHistory();
    useState(() => {
        new Oidc.UserManager({ response_mode: 'query' })
            .signinRedirectCallback()
            .then(function () {
                history.push('/dashboard');
            })
            .catch(function (e) {
                console.error(e);
            });
        // @ts-ignore
    }, []);
    return (
        <React.Fragment>
            <LoadingPlaceholder />
        </React.Fragment>
    );
};
export default AuthCallback;
