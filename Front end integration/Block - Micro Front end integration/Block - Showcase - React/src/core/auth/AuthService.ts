import { UserManager, WebStorageStateStore } from 'oidc-client';
import { IdentityConfig } from '@core/config/IdentityConfig';

export default class AuthService {
    UserManager;

    constructor() {
        this.UserManager = new UserManager({
            response_mode: 'query',
            ...IdentityConfig,
            userStore: new WebStorageStateStore({
                store: window.sessionStorage,
            }),
            monitorSession: true,
            validateSubOnSilentRenew: true,
        });

        this.UserManager.events.addUserLoaded((user) => {
            if (window.location.href.indexOf('signin-oidc') !== -1) {
                this.navigateToScreen();
            }
        });
        this.UserManager.events.addSilentRenewError((e) => {
            console.error('silent renew error', e.message);
        });

        this.UserManager.events.addAccessTokenExpiring(() => {
            console.log('token expiring');
            this.signinSilent();
        });

        this.UserManager.events.addAccessTokenExpired(() => {
            console.log('token expiring');
            this.signinSilent();
        });
    }

    signinRedirectCallback = (): void => {
        this.UserManager.signinRedirectCallback().then(
            (something: any) => {
                console.log(something);
            },
            (err) => console.error(err),
        );
    };

    getUser = async () => {
        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token: any) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    signinRedirect = () => {
        localStorage.setItem('redirectUri', window.location.pathname);
        return this.UserManager.signinRedirect();
    };

    navigateToScreen = () => {
        window.location.replace('/en/dashboard');
    };

    isAuthenticated = () => {
        const oidcStorage = JSON.parse(
            sessionStorage.getItem(`oidc.user:${process.env.IDENTITY_SERVER_URL}:${process.env.IDENTITY_SERVER_CLIENT_ID}`),
        );
        return !!oidcStorage && !!oidcStorage.access_token;
    };

    getToken = () => {
        const token_data = JSON.parse(
            sessionStorage.getItem(`oidc.user:${process.env.IDENTITY_SERVER_URL}:${process.env.IDENTITY_SERVER_CLIENT_ID}`),
        );
        return token_data?.id_token;
    };

    signinSilent = () => {
        this.UserManager.signinSilent()
            .then((user) => {
                console.log('signed in', user);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    signinSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = (): void => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem('id_token'),
        });
        this.UserManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            window.location.replace(process.env.WEB_APP_URL);
        });
        this.UserManager.clearStaleState();
    };
}
