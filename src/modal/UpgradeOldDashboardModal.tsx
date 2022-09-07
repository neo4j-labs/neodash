
import React from 'react';
import { TextareaAutosize } from '@material-ui/core';
import { HeroIcon, Button, Dialog } from '@neo4j-ndl/react';


export const NeoUpgradeOldDashboardModal = ({ open, text, clearOldDashboard, loadDashboard }) => {
    return (
        <div>
            <Dialog size="large" open={open == true} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                    Old Dashboard Found
                </Dialog.Header>
                <Dialog.Content>
                    We've found a dashboard built with an old version of NeoDash.
                    Would you like to attempt an upgrade, or start from scratch?
                    <br />
                    <b>Make sure you back up this dashboard first!</b>
                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                        <Button onClick={() => {
                            localStorage.removeItem("neodash-dashboard");
                            clearOldDashboard();
                        }}
                            style={{ marginRight: "20px" }}
                            color="danger"
                            floating>
                            Delete old dashboard
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="TrashIcon" />
                        </Button>
                        <Button onClick={() => {
                            localStorage.removeItem("neodash-dashboard");
                            loadDashboard(text);
                            clearOldDashboard();
                        }}
                            style={{ marginRight: "6px" }}
                            color="success"
                            buttonSize="large"
                            floating>
                            Upgrade
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                        </Button>
                    </div>
                    <TextareaAutosize
                        style={{ minHeight: "200px", width: "100%", border: "1px solid lightgray" }}
                        className={"textinput-linenumbers"}
                        onChange={(e) => { }}
                        value={text ? text : ""}
                        aria-label=""
                        placeholder="" />
                </Dialog.Content>
            </Dialog>
        </div >
    );
}

export default (NeoUpgradeOldDashboardModal);


