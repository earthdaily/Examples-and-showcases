//const background = require('assets/img/background.jpg');
import styled from 'styled-components';

const LoadingPlaceholder = styled.div`
    background-image: url('public/background.jpg');
    /* Full height */
    height: 100%;
    padding: 0;
    margin: 0;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

export default LoadingPlaceholder;
