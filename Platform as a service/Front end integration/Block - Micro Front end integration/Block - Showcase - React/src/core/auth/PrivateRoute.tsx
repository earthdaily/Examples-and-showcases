import React from 'react';
import { Route } from 'react-router-dom';
import { AuthConsumer } from './../context/authProvider';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';

// @ts-ignore
// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ component, path, ...rest }) => {
    // eslint-disable-next-line react/display-name
    const renderFn = (Component: any) => () => (
        <AuthConsumer>
            {({ isAuthenticated, signinRedirect }) => {
                if (!!Component && isAuthenticated()) {
                    return <Route path={path} component={Component} />;
                } else {
                    signinRedirect();
                    return (
                        <React.Fragment>
                            <LoadingPlaceholder />
                        </React.Fragment>
                    );
                }
            }}
        </AuthConsumer>
    );

    // @ts-ignore
    return <Route {...rest} render={renderFn(component)} />;
};
