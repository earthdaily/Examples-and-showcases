import WeatherWidgetPage from '../../pages/weather-widget/WeatherWidgetPage';
import BoundaryManagementPage from '../../pages/boundary-management-page/BoundaryManagementPage';
import TimeSeriesViewerPage from '../../pages/time-series-viewer/TimeSeriesViewerPage';

export const AvailableMicrofrontends = [
    {
        name: 'Boundary Management',
        component: BoundaryManagementPage,
        enabled: true,
        path: 'boundary-management',
    },
    {
        name: 'Weather Widget',
        component: WeatherWidgetPage,
        enabled: true,
        path: 'weather-widget',
    },
    {
        name: 'Time Series',
        component: TimeSeriesViewerPage,
        enabled: true,
        path: 'time-series-viewer',
    },
];
