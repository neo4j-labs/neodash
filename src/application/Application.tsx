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
import { applicationGetConnection, applicationGetShareDetails, applicationGetOldDashboard, applicationHasNeo4jDesktopConnection, applicationHasAboutModalOpen, applicationHasCachedDashboard, applicationHasConnectionModalOpen, applicationIsConnected, applicationHasWelcomeScreenOpen, applicationGetDebugState, applicationGetStandaloneSettings, applicationGetSsoSettings } from '../application/ApplicationSelectors';
import { createConnectionThunk, createConnectionFromDesktopIntegrationThunk, setDatabaseFromNeo4jDesktopIntegrationThunk, handleSharedDashboardsThunk, onConfirmLoadSharedDashboardThunk, loadApplicationConfigThunk } from '../application/ApplicationThunks';
import { clearDesktopConnectionProperties, clearNotification, resetShareDetails, setAboutModalOpen, setConnected, setConnectionModalOpen, setDashboardToLoadAfterConnecting, setOldDashboard, setStandAloneMode, setWaitForSSO, setWelcomeScreenOpen } from '../application/ApplicationActions';
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
 * This is the main application component for NeoDash.
 * It contains:
 * - The Dashboard component
 * - A number of modals (pop-up windows) that handle connections, loading/saving dashboards, etc.
 * 
 * Parts of the application state are retrieved here and passed to the relevant compoenents.
 * State-changing actions are also dispatched from here. See `ApplicationThunks.tsx`, `ApplicationActions.tsx` and `ApplicationSelectors.tsx` for more info.
 */
const Application = ({ connection, connected, hasCachedDashboard, oldDashboard, clearOldDashboard,
    connectionModalOpen, ssoSettings, standaloneSettings, aboutModalOpen, loadDashboard, hasNeo4jDesktopConnection, shareDetails,
    createConnection, createConnectionFromDesktopIntegration, onResetShareDetails, onConfirmLoadSharedDashboard,
    initializeApplication, resetDashboard, onAboutModalOpen, onAboutModalClose, getDebugState,
    welcomeScreenOpen, setWelcomeScreenOpen, onConnectionModalOpen, onConnectionModalClose, onSSOAttempt }) => {

    const [initialized, setInitialized] = React.useState(false);
    if (!initialized) {
        setInitialized(true);
        initializeApplication(initialized);
    }

    // Only render the dashboard component if we have an active Neo4j connection.
    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <NeoDashboardPlaceholder connected={false}></NeoDashboardPlaceholder>
            {(connected) ? <Dashboard></Dashboard> : <></>}
            <NeoAboutModal
                open={aboutModalOpen}
                handleClose={onAboutModalClose}
                getDebugState={getDebugState}>
            </NeoAboutModal>
            <NeoConnectionModal
                open={connectionModalOpen}
                dismissable={connected}
                connection={connection}
                ssoSettings={ssoSettings}
                standalone={standaloneSettings.standalone}
                standaloneSettings={standaloneSettings}
                createConnection={createConnection}
                onSSOAttempt={onSSOAttempt}
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
    ssoSettings: applicationGetSsoSettings(state),
    standaloneSettings: applicationGetStandaloneSettings(state),
    connectionModalOpen: applicationHasConnectionModalOpen(state),
    aboutModalOpen: applicationHasAboutModalOpen(state),
    welcomeScreenOpen: applicationHasWelcomeScreenOpen(state),
    hasCachedDashboard: applicationHasCachedDashboard(state),
    getDebugState: () => {return applicationGetDebugState(state)},
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
    initializeApplication: (initialized) => {
        if(!initialized){
            dispatch(loadApplicationConfigThunk());
        }
        
    },
    onResetShareDetails: _ => {
        dispatch(setWelcomeScreenOpen(true));
        dispatch(resetShareDetails());
    },
    onSSOAttempt: _ => {
        dispatch(setWaitForSSO(true));
    },
    onConfirmLoadSharedDashboard: _ => dispatch(onConfirmLoadSharedDashboardThunk()),
    onConnectionModalOpen: _ => dispatch(setConnectionModalOpen(true)),
    onConnectionModalClose: _ => dispatch(setConnectionModalOpen(false)),
    onAboutModalOpen: _ => dispatch(setAboutModalOpen(true)),
    setWelcomeScreenOpen: open => dispatch(setWelcomeScreenOpen(open)),
    onAboutModalClose: _ => dispatch(setAboutModalOpen(false)),
});


export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Application));