import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import { AvailableMicrofrontends } from '@core/config/AvailableMicrofrontends';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useAppDispatch } from '@core/store/hooks';
import { logout } from '@core/store/slices/AuthSlice';
import { ExitToApp } from '@material-ui/icons';
import MfeRoutes from '@core/routes/MfeRoutes';
import './Dashboard.scss';
import ListItemLink from './shared/ListItemLink';

const drawerWidth = 203;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            margin: 0,
            padding: 0,
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#f5f5f5',
        },
        leftToolbar: {
            display: 'flex',
            paddingLeft: '10px',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerLogo: {},
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        logout: {
            marginRight: 0,
        },
    }),
);

const Dashboard = () => {
    const { path, url } = useRouteMatch();
    const dispatch = useAppDispatch();
    const history = useHistory();

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar elevation={0} position='fixed' className={classes.appBar}>
                <Toolbar className={classes.toolbar} variant={'regular'}>
                    <div className={classes.leftToolbar}>
                        <img
                            src='public/EarthDaily-Agro-logo.svg'
                            style={{ cursor: 'pointer' }}
                            height='50'
                            width='100'
                            alt=''
                            onClick={() => history.push('/dashboard')}
                        />
                    </div>
                    <div>
                        <IconButton
                            color='default'
                            aria-label='open drawer'
                            onClick={() => dispatch(logout())}
                            edge='start'
                            className={classes.menuButton}
                        >
                            <ExitToApp />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            <div className='sidebar'>
                <List>
                    {/* render the links on the sidenav*/}
                    {AvailableMicrofrontends.map((node: any, index: number) => (
                        <ListItemLink key={index} text={node.name} to={node.path} url={url} />
                    ))}
                </List>
            </div>

            <div className='content'>
                <MfeRoutes path={path} />
            </div>
        </div>
    );
};

export default Dashboard;
