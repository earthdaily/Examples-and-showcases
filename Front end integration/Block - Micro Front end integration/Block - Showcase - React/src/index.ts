import { loadRemoteEntry } from '@core/mf-runtime/dynamic-federation';

Promise.all([
    loadRemoteEntry(
        `${process.env.MFE_WEATHER_WIDGET_REMOTE_ENTRY}/remoteEntry.js?v=${new Date().getTime().toString()}`,
        process.env.MFE_WEATHER_WIDGET_REMOTE_NAME,
    ),
    loadRemoteEntry(`${process.env.MFE_TSV_REMOTE_ENTRY}/remoteEntry.js?v=${new Date().getTime().toString()}`, process.env.MFE_TSV_REMOTE_NAME),
    loadRemoteEntry(
        `${process.env.MFE_BOUNDARY_MANAGEMENT_REMOTE_ENTRY}/remoteEntry.js?v=${new Date().getTime().toString()}`,
        process.env.MFE_BOUNDARY_MANAGEMENT_REMOTE_NAME,
    ),
])
    .catch((err) => console.error('Error loading remote entries', err))
    .then(() => import('./bootstrap'))
    .catch((err) => console.error(err));
