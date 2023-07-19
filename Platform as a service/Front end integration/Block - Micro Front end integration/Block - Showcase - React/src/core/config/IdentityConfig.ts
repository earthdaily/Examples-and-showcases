import { OidcClientSettings } from 'oidc-client';

export const IdentityConfig = {
    authority: process.env.IDENTITY_SERVER_URL,
    client_id: 'mfe_demonstrator_web',
    redirect_uri: `${window.location.origin}/#/callback`,
    silent_redirect_uri: `${window.location.origin}/#/silent-renew`,
    post_logout_redirect_uri: `${process.env.WEB_APP_URL}/#/loggedout`,
    response_type: 'code',
    includeIdTokenInSilentRenew: true,
    automaticSilentRenew: true,
    loadUserInfo: false,
    metadataUrl: `${process.env.IDENTITY_SERVER_URL}/.well-known/openid-configuration`,
    scope: 'openid',
} as OidcClientSettings;

export const IdentityMetadata = {
    issuer: process.env.IDENTITY_SERVER_URL,
    jwks_uri: `${process.env.IDENTITY_SERVER_URL}/.well-known/openid-configuration/jwks`,
    authorization_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/authorize`,
    token_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/token`,
    userinfo_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/userinfo`,
    end_session_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/endsession`,
    check_session_iframe: `${process.env.IDENTITY_SERVER_URL}/connect/checksession`,
    revocation_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/revocation`,
    introspection_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/introspect`, //,
    //device_authorization_endpoint: `${process.env.IDENTITY_SERVER_URL}/connect/deviceauthorization`,
};
