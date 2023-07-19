import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import IdentityLogin from '../../components/IdentityLogin';
import AuthCallback from '../auth/AuthCallback';
import WelcomePage from '../../pages/WelcomePage';
import SilentRenewCallback from '@core/auth/SilentRenewCallback';
import { LogoutCallback } from '@core/auth/LogoutCallback';
import { PrivateRoute } from '@core/auth/PrivateRoute';

const Routes = () => (
    <HashRouter>
        <Switch>
            <Route exact path='/' component={IdentityLogin} />
            <Route path='/callback' component={AuthCallback} />
            <Route path='/silent-renew' component={SilentRenewCallback} />
            <PrivateRoute path='/dashboard' component={WelcomePage} />
            <Route path='/loggedout' component={LogoutCallback} />
            <Route path='*'>
                <Redirect to='/dashboard' />
            </Route>
        </Switch>
    </HashRouter>
);

export default Routes;
