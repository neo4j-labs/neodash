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
import { applicationGetConnection, applicationGetShareDetails, applicationGetOldDashboard, applicationHasNeo4jDesktopConnection, applicationHasAboutModalOpen, applicationHasCachedDashboard, applicationHasConnectionModalOpen, applicationIsConnected, applicationHasWelcomeScreenOpen } from '../application/ApplicationSelectors';
import { createConnectionThunk, createConnectionFromDesktopIntegrationThunk, setDatabaseFromNeo4jDesktopIntegrationThunk, handleSharedDashboardsThunk, onConfirmLoadSharedDashboardThunk } from '../application/ApplicationThunks';
import { clearDesktopConnectionProperties, clearNotification, resetShareDetails, setAboutModalOpen, setConnected, setConnectionModalOpen, setDashboardToLoadAfterConnecting, setOldDashboard, setStandAloneMode, setWelcomeScreenOpen } from '../application/ApplicationActions';
import { resetDashboardState } from '../dashboard/DashboardActions';
import { NeoDashboardPlaceholder } from '../dashboard/DashboardPlaceholder';
import NeoConnectionModal from '../modal/ConnectionModal';
import Dashboard from '../dashboard/Dashboard';
import { CircularProgress, Typography } from '@material-ui/core';
import NeoAboutModal from '../modal/AboutModal';
import { NeoUpgradeOldDashboardModal } from '../modal/UpgradeOldDashboardModal';
import { loadDashboardThunk } from '../dashboard/DashboardThunks';
import { NeoLoadSharedDashboardModal } from '../modal/LoadSharedDashboardModal';

/**
 * 
 */
const Application = ({ connection, connected, hasCachedDashboard, oldDashboard, clearOldDashboard,
    connectionModalOpen, aboutModalOpen, loadDashboard, hasNeo4jDesktopConnection, shareDetails,
    createConnection, createConnectionFromDesktopIntegration, onResetShareDetails, onConfirmLoadSharedDashboard,
    initializeApplication, resetDashboard, onAboutModalOpen, onAboutModalClose,
    welcomeScreenOpen, setWelcomeScreenOpen, onConnectionModalOpen, onConnectionModalClose }) => {

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
                welcomeScreenOpen={welcomeScreenOpen}
                setWelcomeScreenOpen={setWelcomeScreenOpen}
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
            <NeoLoadSharedDashboardModal
                shareDetails={shareDetails}
                onResetShareDetails={onResetShareDetails}
                onConfirmLoadSharedDashboard={onConfirmLoadSharedDashboard}>
            </NeoLoadSharedDashboardModal>
            <NeoNotificationModal></NeoNotificationModal>
        </div>
    );
}

const mapStateToProps = state => ({
    connected: applicationIsConnected(state),
    connection: applicationGetConnection(state),
    shareDetails: applicationGetShareDetails(state),
    oldDashboard: applicationGetOldDashboard(state),
    connectionModalOpen: applicationHasConnectionModalOpen(state),
    aboutModalOpen: applicationHasAboutModalOpen(state),
    welcomeScreenOpen: applicationHasWelcomeScreenOpen(state),
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
        dispatch(setDashboardToLoadAfterConnecting(null));
        dispatch(setStandAloneMode(false));
        dispatch(setWelcomeScreenOpen(true));
        dispatch(clearNotification());
        dispatch(handleSharedDashboardsThunk());
        dispatch(setConnectionModalOpen(false));
    },
    onResetShareDetails: _ => {
        dispatch(setWelcomeScreenOpen(true));
        dispatch(resetShareDetails());
    },
    onConfirmLoadSharedDashboard: _ => dispatch(onConfirmLoadSharedDashboardThunk()),
    onConnectionModalOpen: _ => dispatch(setConnectionModalOpen(true)),
    onConnectionModalClose: _ => dispatch(setConnectionModalOpen(false)),
    onAboutModalOpen: _ => dispatch(setAboutModalOpen(true)),
    setWelcomeScreenOpen: open => dispatch(setWelcomeScreenOpen(open)),
    onAboutModalClose: _ => dispatch(setAboutModalOpen(false)),
});


export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Application));