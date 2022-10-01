import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';


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
            <Dialog maxWidth="xs" open={welcomeScreenOpen == true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">NeoDash - Neo4j Dashboard Builder
                    <IconButton disabled style={{ color: "white", padding: "5px", float: "right" }}>
                        ⚡
                    </IconButton>
                </DialogTitle>
                <DialogContent>

                    <Tooltip title="Connect to Neo4j and create a new dashboard." aria-label="">
                        <Button onClick={() => {
                            if (hasCachedDashboard) {
                                handlePromptOpen(); handleClose();
                            } else {
                                onConnectionModalOpen(); handleClose();
                            }
                        }}
                            style={{ marginTop: "10px", width: "100%", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="large">
                            New Dashboard
                        </Button>
                    </Tooltip>

                    <Tooltip title="Load the existing dashboard from cache (if it exists)." aria-label="">
                        {(hasCachedDashboard) ?
                            <Button onClick={(e) => { handleClose(); onConnectionModalOpen(); }}
                                style={{ marginTop: "10px", width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                Existing Dashboard
                            </Button> : <Button disabled
                                style={{ marginTop: "10px",  width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                Existing Dashboard
                            </Button>
                        }
                    </Tooltip>
                    {hasNeo4jDesktopConnection ?
                        <Tooltip title="Connect to an active database in Neo4j Desktop." aria-label="">
                            <Button onClick={(e) => { handleClose(); createConnectionFromDesktopIntegration(); }}
                                style={{ marginTop: "10px", width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                Connect to Neo4j Desktop
                            </Button>
                        </Tooltip> : <Button disabled onClick={handleClose}
                            style={{ marginTop: "10px", width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                            color="default"
                            variant="contained"
                            size="large">
                            Connect to Neo4j Desktop
                        </Button>}

                    <Tooltip title="Try a demo dashboard with a public Neo4j database." aria-label="">
                        <a style={{textDecoration: "none"}} target="_blank" href="http://neodash.graphapp.io/?share&type=file&id=https%3A%2F%2Fgist.githubusercontent.com%2Fnielsdejong%2F50a1d13002bdba70d24f2a5643896aa3%2Fraw%2Fd69841693c1fed9e3237920361fa882b53268401%2Fdemo-dashboard-2.1.json&dashboardDatabase=neo4j&credentials=neo4j%2Bs%3A%2F%2Ffincen%3Afincen%40fincen%3Ademo.neo4jlabs.com%3A7687">
                            <Button
                                style={{ marginTop: "10px", width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                Try a Demo
                            </Button>
                        </a>
                    </Tooltip>

                    <Tooltip title="Show information about this application." aria-label="">
                        <Button onClick={onAboutModalOpen}
                            style={{ marginTop: "10px", width: "100%", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                            color="default"
                            variant="contained"
                            size="large">
                            {/**/}
                            About
                        </Button>
                    </Tooltip>


                    <br />
                    <IconButton aria-label="delete">
                    </IconButton>



                </DialogContent>
                <DialogActions style={{ background: "#555" }}>
                    <DialogContent>
                        <DialogContentText style={{ color: "lightgrey" }}>
                            NeoDash is a tool for building standalone Neo4j dashboards. Need advice on building an integrated solution? <a style={{ color: "white" }} href="mailto:niels.dejong@neo4j.com">Get in touch</a>!
                        </DialogContentText>
                    </DialogContent>
                </DialogActions>
            </Dialog>

            {/* Prompt when creating new dashboard with existing cache */}
            <Dialog maxWidth="xs" open={promptOpen == true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create new dashboard
                    <IconButton disabled style={{ color: "white", padding: "5px", float: "right" }}>
                        ⚠️
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to create a new dashboard?
                    This will remove your currently cached dashboard.
                </DialogContent>
                <DialogActions style={{ background: "white" }}>
                    <DialogContent>
                        <DialogContentText style={{ color: "black" }}>
                            <Button onClick={(e) => { handleOpen(); handlePromptClose(); }}
                                style={{ marginTop: "10px", float: "right", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                No
                            </Button>
                            <Button onClick={(e) => { handleClose(); handlePromptClose(); resetDashboard(); onConnectionModalOpen(); }}
                                style={{ marginTop: "10px", float: "right", backgroundColor: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" }}
                                color="default"
                                variant="contained"
                                size="large">
                                Yes
                            </Button>

                        </DialogContentText>
                    </DialogContent>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default (NeoWelcomeScreenModal);