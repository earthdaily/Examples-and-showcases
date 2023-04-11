import React, { Component } from 'react';
import AuthService from '../auth/AuthService';

const AuthContext = React.createContext(new AuthService());

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends Component {
    authService;
    constructor(props: Record<string, never>) {
        super(props);
        this.authService = new AuthService();
    }
    render() {
        // eslint-disable-next-line react/prop-types
        return <AuthContext.Provider value={this.authService}>{this.props.children}</AuthContext.Provider>;
    }
}
