export const getToken = () =>
    JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.IDENTITY_SERVER_URL}:${process.env.IDENTITY_SERVER_CLIENT_ID}`)).access_token;
