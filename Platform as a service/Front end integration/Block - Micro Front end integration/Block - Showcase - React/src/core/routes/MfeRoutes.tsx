import { Redirect, Route, Switch } from 'react-router-dom';
import React, { FC, PropsWithChildren } from 'react';
import BoundaryManagementPage from '../../pages/boundary-management-page/BoundaryManagementPage';
import WeatherWidgetPage from '../../pages/weather-widget/WeatherWidgetPage';
import TimeSeriesViewerPage from '../../pages/time-series-viewer/TimeSeriesViewerPage';
import Documentation from '../../components/Documentation';

interface IProps {
    path: string;
}

const MfeRoutes: FC<IProps> = (props: PropsWithChildren<IProps>): JSX.Element => (
    <Switch>
        <Route exact path={props.path} component={Documentation} />
        <Route path='/dashboard/boundary-management' component={BoundaryManagementPage} />
        <Route path='/dashboard/weather-widget' component={WeatherWidgetPage} />
        <Route path='/dashboard/time-series-viewer' component={TimeSeriesViewerPage} />
        <Route path='/dashboard/*'>
            <Redirect to='/dashboard' />
        </Route>
    </Switch>
);

export default MfeRoutes;
