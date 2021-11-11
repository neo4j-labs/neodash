import React from 'react';
import { hot } from 'react-hot-loader';
import NeoPage from '../page/Page';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import NeoDrawer from '../dashboard/DashboardDrawer';
import NeoDashboardHeader from '../dashboard/DashboardHeader';
import { createDriver, Neo4jProvider } from 'use-neo4j';
import NeoNotificationModal from '../modal/NotificationModal';
import NeoWelcomeScreenModal from '../modal/WelcomeScreenModal';
import { removeReportRequest } from '../page/PageThunks';
import { connect } from 'react-redux';
import { applicationGetConnection, applicationHasAboutModalOpen, applicationHasCachedDashboard, applicationHasConnectionModalOpen, applicationIsConnected } from '../application/ApplicationSelectors';
import { createConnectionThunk } from '../application/ApplicationThunks';
import { clearNotification, setAboutModalOpen, setConnected, setConnectionModalOpen } from '../application/ApplicationActions';
import { resetDashboardState } from '../dashboard/DashboardActions';
import { NeoDashboardPlaceholder } from '../dashboard/DashboardPlaceholder';
import NeoConnectionModal from '../modal/ConnectionModal';
import Dashboard from '../dashboard/Dashboard';
import { CircularProgress, Typography } from '@material-ui/core';
import NeoAboutModal from '../modal/AboutModal';

/**
 * 
 */
const Application = ({ connection, connected, hasCachedDashboard, connectionModalOpen, aboutModalOpen,
    createConnection, initializeApplication, resetDashboard, onAboutModalOpen, onAboutModalClose,
    onConnectionModalOpen, onConnectionModalClose }) => {

    const [initialized, setInitialized] = React.useState(false);

    if (!initialized) {
        initializeApplication();
        setInitialized(true);
    }

    // Only render the dashboard component if we have an active Neo4j connection.
    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <NeoDashboardPlaceholder connected={false}></NeoDashboardPlaceholder>
            {(connected) ? <Dashboard></Dashboard>:  <></>}

            <NeoNotificationModal></NeoNotificationModal>
            <NeoAboutModal
                open={aboutModalOpen}
                handleClose={onAboutModalClose}>
            </NeoAboutModal>
            <NeoConnectionModal
                open={connectionModalOpen}
                connection={connection}
                createConnection={createConnection}
                onConnectionModalClose={onConnectionModalClose} ></NeoConnectionModal>
            <NeoWelcomeScreenModal
                hasCachedDashboard={hasCachedDashboard}
                onConnectionModalOpen={onConnectionModalOpen}
                onAboutModalOpen={onAboutModalOpen}
                resetDashboard={resetDashboard}></NeoWelcomeScreenModal>
        </div>
    );
}

const mapStateToProps = state => ({
    connected: applicationIsConnected(state),
    connection: applicationGetConnection(state),
    connectionModalOpen: applicationHasConnectionModalOpen(state),
    aboutModalOpen: applicationHasAboutModalOpen(state),
    hasCachedDashboard: applicationHasCachedDashboard(state),
});

const mapDispatchToProps = dispatch => ({
    createConnection: (protocol, url, port, database, username, password) => {
        dispatch(setConnected(false));
        dispatch(createConnectionThunk(protocol, url, port, database, username, password));
    },
    resetDashboard: _ => dispatch(resetDashboardState()),
    initializeApplication: _ => {
        dispatch(setConnected(false));
        dispatch(clearNotification());
        dispatch(setConnectionModalOpen(false));
    },
    onConnectionModalOpen: _ => dispatch(setConnectionModalOpen(true)),
    onConnectionModalClose: _ => dispatch(setConnectionModalOpen(false)),
    onAboutModalOpen: _ => dispatch(setAboutModalOpen(true)),
    onAboutModalClose: _ => dispatch(setAboutModalOpen(false)),
});


export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Application));