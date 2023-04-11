import React, { FC } from 'react';
import styled from 'styled-components';
import Dashboard from '../components/Dashboard';

const WelcomePage: FC = () => {
    return (
        <React.Fragment>
            <AllContainer>
                <Dashboard />
            </AllContainer>
        </React.Fragment>
    );
};
const AllContainer = styled.div`
    //overflow-y: hidden;
    width: 100%;
    height: 100%;
    top: 50px;
    padding-top: 50px;
`;

export default WelcomePage;
