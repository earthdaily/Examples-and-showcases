import React from 'react';
import { FC } from 'react';
import { AuthConsumer } from '../context/authProvider';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';

const Logout: FC = (): JSX.Element => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <LoadingPlaceholder />;
        }}
    </AuthConsumer>
);

export default Logout;
