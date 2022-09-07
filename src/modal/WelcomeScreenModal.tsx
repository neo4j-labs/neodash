import React from 'react';
import { Tooltip } from '@material-ui/core';
import { HeroIcon, Button, Dialog } from '@neo4j-ndl/react';


/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoWelcomeScreenModal = ({ welcomeScreenOpen, setWelcomeScreenOpen,
    hasCachedDashboard, hasNeo4jDesktopConnection, createConnectionFromDesktopIntegration, resetDashboard,
    onConnectionModalOpen, onAboutModalOpen }) => {

    const [promptOpen, setPromptOpen] = React.useState(false);
    const handleOpen = () => {
        setWelcomeScreenOpen(true);
    };
    const handleClose = () => {
        setWelcomeScreenOpen(false);
    };
    const handlePromptOpen = () => {
        setPromptOpen(true);
    };
    const handlePromptClose = () => {
        setPromptOpen(false);
    };


    return (
        <div>
            <Dialog size="small" open={welcomeScreenOpen == true} aria-labelledby="form-dialog-title" disableCloseButton>
                <Dialog.Header id="form-dialog-title">NeoDash - Neo4j Dashboard Builder
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" color="gold" iconName="LightningBoltIcon"
                        style={{ float: "right" }}
                    />
                </Dialog.Header>
                <Dialog.Content>
                    <Tooltip title="Connect to Neo4j and create a new dashboard." aria-label="create">
                        <Button onClick={() => {
                            if (hasCachedDashboard) {
                                handlePromptOpen(); handleClose();
                            } else {
                                onConnectionModalOpen(); handleClose();
                            }
                        }}
                            style={{ marginTop: "10px", width: "100%" }}
                            fill="outlined"
                            color="primary"
                            buttonSize="large">
                            New Dashboard
                        </Button>
                    </Tooltip>

                    <Tooltip title="Load the existing dashboard from cache (if it exists)." aria-label="load">
                        {(hasCachedDashboard) ?
                            <Button onClick={(e) => { handleClose(); onConnectionModalOpen(); }}
                                style={{ marginTop: "10px", width: "100%" }}
                                fill="outlined"
                                color="primary"
                                buttonSize="large">
                                Existing Dashboard
                            </Button> : <Button disabled
                                style={{ marginTop: "10px",  width: "100%" }}
                                fill="outlined"
                                color="neutral"
                                buttonSize="large">
                                Existing Dashboard
                            </Button>
                        }
                    </Tooltip>
                    {hasNeo4jDesktopConnection ?
                        <Tooltip title="Connect to an active database in Neo4j Desktop." aria-label="connect">
                            <Button onClick={(e) => { handleClose(); createConnectionFromDesktopIntegration(); }}
                                style={{ marginTop: "10px", width: "100%" }}
                                fill="outlined"
                                color="neutral"
                                buttonSize="large">
                                Connect to Neo4j Desktop
                            </Button>
                        </Tooltip> : <Button disabled onClick={handleClose}
                            style={{ marginTop: "10px", width: "100%" }}
                            fill="outlined"
                            color="neutral"
                            buttonSize="large">
                            Connect to Neo4j Desktop
                        </Button>}

                    <Tooltip title="Try a demo dashboard with a public Neo4j database." aria-label="demo">
                        <Button
                            target="_blank" href="http://neodash.graphapp.io/?share&type=file&id=https%3A%2F%2Fgist.githubusercontent.com%2Fnielsdejong%2F50a1d13002bdba70d24f2a5643896aa3%2Fraw%2Fd69841693c1fed9e3237920361fa882b53268401%2Fdemo-dashboard-2.1.json&dashboardDatabase=neo4j&credentials=neo4j%2Bs%3A%2F%2Ffincen%3Afincen%40fincen%3Ademo.neo4jlabs.com%3A7687"
                            style={{ marginTop: "10px", width: "100%" }}
                            fill="outlined"
                            color="neutral"
                            buttonSize="large">
                            Try a Demo
                        </Button>
                    </Tooltip>

                    <Tooltip title="Show information about this application." aria-label="">
                        <Button onClick={onAboutModalOpen}
                            style={{ marginTop: "10px", width: "100%" }}
                            fill="outlined"
                            color="neutral"
                            buttonSize="large">
                            About
                        </Button>
                    </Tooltip>
                </Dialog.Content>
                <Dialog.Actions style={{ background: "#555", marginLeft: "-3rem", marginRight: "-3rem", marginBottom: "-3rem", padding:"3rem" }}>
                    <div style={{ color: "lightgrey" }}>
                        NeoDash is a tool for building standalone Neo4j dashboards. Need advice on building an integrated solution? <a style={{ color: "white" }} href="mailto:niels.dejong@neo4j.com">Get in touch</a>!
                    </div>
                </Dialog.Actions>
            </Dialog>

            {/* Prompt when creating new dashboard with existing cache */}
            <Dialog size="small" open={promptOpen == true} aria-labelledby="form-dialog-title" disableCloseButton>
                <Dialog.Header id="form-dialog-title">Create new dashboard
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" color="orange" iconName="ExclamationIcon"
                        style={{ float: "right" }}/>
                </Dialog.Header>
                <Dialog.Content>
                    Are you sure you want to create a new dashboard?
                    This will remove your currently cached dashboard.
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onClick={(e) => { handleOpen(); handlePromptClose(); }}
                        style={{ marginTop: "10px", float: "right" }}
                        color="primary"
                        fill="outlined">
                        No
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ReplyIcon" />
                    </Button>
                    <Button onClick={(e) => { handleClose(); handlePromptClose(); resetDashboard(); onConnectionModalOpen(); }}
                        style={{ marginTop: "10px", float: "right", marginRight: "5px" }}
                        color="danger">
                        Yes
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </div>
    );
}

export default (NeoWelcomeScreenModal);