import React from 'react';
import { AuthConsumer } from '@core/context/authProvider';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';

export const LogoutCallback = () => (
    <AuthConsumer>
        {({ signoutRedirectCallback }) => {
            signoutRedirectCallback();
            return <LoadingPlaceholder />;
        }}
    </AuthConsumer>
);
