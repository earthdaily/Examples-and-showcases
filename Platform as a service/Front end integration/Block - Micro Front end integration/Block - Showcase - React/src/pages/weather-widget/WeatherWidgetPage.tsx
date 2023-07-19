import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import { FormControl, InputLabel, MenuItem, MuiThemeProvider } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { getGrowers, selectedGrowerId, selectGrowers, selectSelectedGrowerId } from '@core/store/slices/GrowerSlice';
import { Grower } from '@core/models/geosys/Grower';
import { getSeasonFields, selectedSeasonFieldId, selectSeasonFields, selectSelectedSeasonFieldId } from '@core/store/slices/SeasonFieldSlice';
import { SeasonFieldResponse } from '@core/models/geosys/SeasonFieldResponse';
import './WeatherWidgetPage.scss';
import { loadRemoteModule } from '@core/mf-runtime/dynamic-federation';
import { createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getToken } from '@core/auth/authUtils';

interface IWeatherWidget {
    point: string;
    gddThreashold: number;
    date: Date;
    seasonFieldSowingDate: Date;
    culture: string;
    token: string;
    remoteUrl: string;
}

const WeatherWidgetPage: FC = (): JSX.Element => {
    let weatherWidgetModule: any | null = null;
    const dispatch = useAppDispatch();
    const growers = useAppSelector(selectGrowers);
    const seasonFields = useAppSelector(selectSeasonFields);
    const selectedGrower = useAppSelector(selectSelectedGrowerId);
    const selectedSeasonField = useAppSelector(selectSelectedSeasonFieldId);
    const [openGrowers, setOpenGrowers] = useState(false);
    const [openSeasonFields, setOpenSeasonFields] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(getCurrentISODate());

    const wwElementRef = React.useRef();

    const loadMFE = async () => {
        // @ts-ignore
        if (wwElementRef.current.innerHTML.length !== 0) {
            // @ts-ignore
            wwElementRef.current.innerHTML = '';
        }

        try {
            weatherWidgetModule = await loadRemoteModule({
                remoteName: process.env.MFE_WEATHER_WIDGET_REMOTE_NAME,
                exposedModule: process.env.MFE_WEATHER_WIDGET_EXPOSED_MODULE,
            });
            await weatherWidgetModule?.mount([wwElementRef.current]);
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
            weatherWidgetModule?.unmount();
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
        const sf = seasonFields.find((sfield: SeasonFieldResponse) => sfield.id === seasonFieldId);
        if (sf) {
            sendEvent(
                {
                    point: sf.centroid,
                    gddThreashold: 10,
                    date: selectedDate,
                    seasonFieldSowingDate: new Date(sf.sowingDate),
                    culture: 'en-US',
                    token: getToken(),
                    remoteUrl: process.env.MFE_WEATHER_WIDGET_REMOTE_ENTRY,
                } /*as IWeatherWidget*/,
            );
        }
    };

    const handleSelectedDate = (date: Date) => {
        setSelectedDate(date);
        const sf = seasonFields.find((sfield: SeasonFieldResponse) => sfield.id === selectedSeasonField);
        if (sf) {
            sendEvent(
                {
                    point: sf.centroid,
                    gddThreashold: 10,
                    date: date,
                    seasonFieldSowingDate: new Date(sf.sowingDate),
                    culture: 'en-US',
                    token: getToken(),
                    remoteUrl: process.env.MFE_WEATHER_WIDGET_REMOTE_ENTRY,
                } /*as IWeatherWidget */,
            );
        }
    };

    const sendEvent = (payload: any): void => {
        const customEvent = new CustomEvent('MFE.Weather.Configure', {
            detail: payload,
        });
        document.dispatchEvent(customEvent);
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

    // @ts-ignore
    return (
        <MuiThemeProvider theme={theme}>
            <CustomContainer>
                <div>
                    <h1>Weather Widget</h1>
                </div>
                <MFEContext>
                    {/********************************************************************/}
                    <ControlContainer>
                        <FormControl variant='outlined'>
                            <InputLabel id='label-growers'>Select a Grower</InputLabel>
                            <CustomSelect
                                labelId='open-growers-label'
                                id='grower-list'
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
                        <FormControl variant='outlined'>
                            <InputLabel id='label-growers-ww'>Select a Season Field</InputLabel>
                            <CustomSelect
                                disabled={!!!selectedGrower}
                                labelId='open-season-field-label'
                                id='season-field-list'
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

                    <ControlContainer>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                disabled={!!!selectedSeasonField}
                                label='Select Date'
                                value={selectedDate}
                                onChange={(e) => handleSelectedDate(e)}
                                inputVariant={'outlined'}
                                format='MM/dd/yyyy'
                                maxDate={getCurrentISODate()}
                                // minDate={addDays(selectedDate, -10)}
                            />
                        </MuiPickersUtilsProvider>
                    </ControlContainer>

                    {/********************************************************************/}
                </MFEContext>

                <WeatherWidgetContainer id='weather-widget-mfe-id' ref={wwElementRef} />
            </CustomContainer>
        </MuiThemeProvider>
    );
};

const getCurrentISODate = (): Date => {
    return new Date(new Date().toISOString());
};

export const MFEContext = styled.div`
    display: flex;
    justify-content: flex-start;
    //flex-direction: column;
    width: 100%;
    height: 100%;
`;

export const ControlContainer = styled.div`
    padding-right: 10px;
`;

export const CustomSelect = styled(Select)`
    width: 250px;
`;

const CustomContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
`;

const WeatherWidgetContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
`;

export default WeatherWidgetPage;
