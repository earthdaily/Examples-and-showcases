import React, { useState } from 'react';
import { useAppDispatch } from '@core/store/hooks';
import { loading, signinRedirect } from '@core/store/slices/AuthSlice';
import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';

const IdentityLogin = () => {
    const dispatch = useAppDispatch();

    useState(() => {
        dispatch(loading(true));
        dispatch(signinRedirect());
        // @ts-ignore
    }, []);
    return (
        <React.Fragment>
            <LoadingPlaceholder />
        </React.Fragment>
    );
};

export default IdentityLogin;
