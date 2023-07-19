import React, { FC, useState } from 'react';

import LoadingPlaceholder from '@core/auth/LoadingPlaceholder';
import { useHistory } from 'react-router-dom';

const Redirect: FC = (): JSX.Element => {
    const history = useHistory();
    // @ts-ignore
    useState(() => history.push('/dashboard'), []);
    return (
        <React.Fragment>
            <LoadingPlaceholder />
        </React.Fragment>
    );
};
export default Redirect;
