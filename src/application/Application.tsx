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
import { applicationGetConnection, applicationGetOldDashboard, applicationHasNeo4jDesktopConnection, applicationHasAboutModalOpen, applicationHasCachedDashboard, applicationHasConnectionModalOpen, applicationIsConnected } from '../application/ApplicationSelectors';
import { createConnectionThunk, createConnectionFromDesktopIntegrationThunk, setDatabaseFromNeo4jDesktopIntegrationThunk } from '../application/ApplicationThunks';
import { clearDesktopConnectionProperties, clearNotification, createNotification, setAboutModalOpen, setConnected, setConnectionModalOpen, setOldDashboard } from '../application/ApplicationActions';
import { resetDashboardState } from '../dashboard/DashboardActions';
import { NeoDashboardPlaceholder } from '../dashboard/DashboardPlaceholder';
import NeoConnectionModal from '../modal/ConnectionModal';
import Dashboard from '../dashboard/Dashboard';
import { CircularProgress, Typography } from '@material-ui/core';
import NeoAboutModal from '../modal/AboutModal';
import { NeoUpgradeOldDashboardModal } from '../modal/UpgradeOldDashboardModal';
import { loadDashboardThunk } from '../dashboard/DashboardThunks';

/**
 * 
 */
const Application = ({ connection, connected, hasCachedDashboard, oldDashboard, clearOldDashboard,
    connectionModalOpen, aboutModalOpen, loadDashboard, hasNeo4jDesktopConnection,
    createConnection, createConnectionFromDesktopIntegration,
    initializeApplication, resetDashboard, onAboutModalOpen, onAboutModalClose,
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
            {(connected) ? <Dashboard></Dashboard> : <></>}

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
                hasNeo4jDesktopConnection={hasNeo4jDesktopConnection}
                onConnectionModalOpen={onConnectionModalOpen}
                createConnectionFromDesktopIntegration={createConnectionFromDesktopIntegration}
                onAboutModalOpen={onAboutModalOpen}
                resetDashboard={resetDashboard}></NeoWelcomeScreenModal>
            <NeoUpgradeOldDashboardModal
                open={oldDashboard}
                text={oldDashboard}
                loadDashboard={loadDashboard}
                clearOldDashboard={clearOldDashboard}>
            </NeoUpgradeOldDashboardModal>
        </div>
    );
}

const mapStateToProps = state => ({
    connected: applicationIsConnected(state),
    connection: applicationGetConnection(state),
    oldDashboard: applicationGetOldDashboard(state),
    connectionModalOpen: applicationHasConnectionModalOpen(state),
    aboutModalOpen: applicationHasAboutModalOpen(state),
    hasCachedDashboard: applicationHasCachedDashboard(state),
    hasNeo4jDesktopConnection: applicationHasNeo4jDesktopConnection(state),
});

const mapDispatchToProps = dispatch => ({
    createConnection: (protocol, url, port, database, username, password) => {
        dispatch(setConnected(false));
        dispatch(createConnectionThunk(protocol, url, port, database, username, password));
    },
    createConnectionFromDesktopIntegration: () => {
        dispatch(setConnected(false));
        dispatch(createConnectionFromDesktopIntegrationThunk());
    },
    loadDashboard: text => {
        dispatch(clearNotification());
        dispatch(loadDashboardThunk(text));

    },
    resetDashboard: _ => dispatch(resetDashboardState()),
    clearOldDashboard: _ => dispatch(setOldDashboard(null)),
    initializeApplication: _ => {
        dispatch(clearDesktopConnectionProperties());
        dispatch(setDatabaseFromNeo4jDesktopIntegrationThunk());
        const old = localStorage.getItem('neodash-dashboard');
        dispatch(setOldDashboard(old));
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