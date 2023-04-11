import { AuthConsumer } from '@core/context/authProvider';
import React from 'react';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';

const SilentRenewCallback = () => (
    <AuthConsumer>
        {({ signinSilent }) => {
            signinSilent();
            console.log('silent renew successfully triggered');
            return <LoadingPlaceholder />;
        }}
    </AuthConsumer>
);

export default SilentRenewCallback;
