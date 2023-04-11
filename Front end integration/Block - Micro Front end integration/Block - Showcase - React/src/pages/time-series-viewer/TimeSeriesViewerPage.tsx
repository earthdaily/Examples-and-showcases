import React, { FC, useEffect, useState } from 'react';
// @ts-ignore
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import { FormControl, InputLabel, MenuItem, MuiThemeProvider } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { getGrowers, selectedGrowerId, selectGrowers, selectSelectedGrowerId } from '@core/store/slices/GrowerSlice';
import { Grower } from '@core/models/geosys/Grower';
import { getSeasonFields, selectedSeasonFieldId, selectSeasonFields, selectSelectedSeasonFieldId } from '@core/store/slices/SeasonFieldSlice';
import { SeasonFieldResponse } from '@core/models/geosys/SeasonFieldResponse';
import './TimeSeriesViewerPage.scss';
import { loadRemoteModule } from '@core/mf-runtime/dynamic-federation';
import { createMuiTheme } from '@material-ui/core/styles';
import { getToken } from '@core/auth/authUtils';

const TimeSeriesViewerPage: FC = (): JSX.Element => {
    let timeSeriesViewerModule: any | null = null;
    const dispatch = useAppDispatch();
    const growers = useAppSelector(selectGrowers);
    const seasonFields = useAppSelector(selectSeasonFields);
    const selectedGrower = useAppSelector(selectSelectedGrowerId);
    const selectedSeasonField = useAppSelector(selectSelectedSeasonFieldId);
    const [openGrowers, setOpenGrowers] = useState(false);
    const [openSeasonFields, setOpenSeasonFields] = useState(false);
    const tsvElementRef = React.useRef();

    const loadMFE = async () => {
        // @ts-ignore
        if (tsvElementRef.current.innerHTML.length !== 0) {
            // @ts-ignore
            tsvElementRef.current.innerHTML = '';
        }
        try {
            timeSeriesViewerModule = await loadRemoteModule({
                remoteName: process.env.MFE_TSV_REMOTE_NAME,
                exposedModule: process.env.MFE_TSV_EXPOSED_MODULE,
            });
            await timeSeriesViewerModule?.mount([tsvElementRef.current]);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        dispatch(getGrowers());
        loadMFE();
        return () => {
            dispatch(selectedGrowerId(''));
            dispatch(selectedSeasonFieldId(''));
            timeSeriesViewerModule?.unmount();
        };
    }, []);

    const handleGrowerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const growerId = event.target.value as string;
        dispatch(selectedGrowerId(growerId));
        dispatch(getSeasonFields(growerId));
    };

    const handleSeasonFieldChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const seasonFieldId = event.target.value as string;
        dispatch(selectedSeasonFieldId(seasonFieldId));

        const seasonField = seasonFields.find((sfield: SeasonFieldResponse) => sfield.id === seasonFieldId);
        if (seasonField !== null && seasonField !== undefined && seasonField.sowingDate !== null) {
            const sowingDate = new Date(seasonField.sowingDate);
            const startDate = new Date(sowingDate.getFullYear(), sowingDate.getMonth(), sowingDate.getDate());
            const endDate = new Date(
                new Date(sowingDate.getFullYear(), sowingDate.getMonth(), sowingDate.getDate()).setDate(startDate.getDate() + 100),
            );

            const event = new CustomEvent('MFE.TimeSeriesViewer.Configure', {
                detail: {
                    spatialUnits: [
                        {
                            type: 'Field',
                            value: seasonField.id,
                            centroid: seasonField.centroid,
                            name: 'Field Name',
                        },
                    ],
                    culture: 'en-US',
                    token: getToken(),
                    remoteUrl: process.env.MFE_TSV_REMOTE_ENTRY,
                    yearsOfHistory: 10,
                    timeframe: {
                        start: startDate,
                        end: endDate,
                    },
                },
            });
            document.dispatchEvent(event);
        }
    };

    const seasonFieldsItems = seasonFields
        ? seasonFields.map((seasonField: SeasonFieldResponse, key: number) => (
              <MenuItem key={key} value={seasonField.id}>
                  {`${seasonField.field.name ?? ''}`}
              </MenuItem>
          ))
        : null;

    const growerItems = growers
        ? growers.map((grower: Grower, key: number) => (
              <MenuItem key={key} value={grower.id}>
                  {`${grower.firstname ?? ''} (${grower.lastname ?? ''}) `}
              </MenuItem>
          ))
        : null;

    const theme = createMuiTheme({
        spacing: 1,
        palette: {
            type: 'light',
            primary: {
                main: '#00b2f4',
                contrastText: '#f5f5f5',
            },
            secondary: {
                main: '#29f2a1',
                contrastText: '#f5f5f5',
            },
        },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <CustomContainer>
                <div>
                    <h1>Time Series</h1>
                </div>
                <MFEContext>
                    {/********************************************************************/}
                    <ControlContainer>
                        <FormControl variant='outlined' size='small'>
                            <InputLabel id='label-growers-tsv'>Select a Grower</InputLabel>
                            <CustomSelect
                                labelId='open-growers-tsv-label'
                                id='grower-list-tsv'
                                variant='outlined'
                                label='Select Growers'
                                open={openGrowers}
                                onClose={() => setOpenGrowers(false)}
                                onOpen={() => setOpenGrowers(true)}
                                value={selectedGrower}
                                onChange={handleGrowerChange}
                                displayEmpty={true}
                            >
                                {growerItems}
                            </CustomSelect>
                        </FormControl>
                    </ControlContainer>

                    {/********************************************************************/}
                    <ControlContainer>
                        <FormControl variant='outlined' size='small'>
                            <InputLabel id='label-season-fields-tsv'>Select a Season Field</InputLabel>
                            <CustomSelect
                                disabled={!!!selectedGrower}
                                labelId='open-season-field-tsv-label'
                                id='season-field-list-tsv'
                                variant='outlined'
                                label='Select Season Fields'
                                open={openSeasonFields}
                                onClose={() => setOpenSeasonFields(false)}
                                onOpen={() => setOpenSeasonFields(true)}
                                value={selectedSeasonField}
                                onChange={handleSeasonFieldChange}
                                displayEmpty={true}
                            >
                                {seasonFieldsItems}
                            </CustomSelect>
                        </FormControl>
                    </ControlContainer>
                    {/********************************************************************/}
                </MFEContext>

                <TSVContainer id='time-series-viewer-mfe-id' ref={tsvElementRef} />
            </CustomContainer>
        </MuiThemeProvider>
    );
};

export const MFEContext = styled.div`
    display: flex;
    width: 100%;
`;

export const CustomSelect = styled(Select)`
    width: 250px;
`;

export const ControlContainer = styled.div`
    padding-right: 10px;
`;

const CustomContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
`;

const TSVContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
`;

export default TimeSeriesViewerPage;
