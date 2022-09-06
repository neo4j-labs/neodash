import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { HeroIcon, IconButton } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoReportHelpModal = ({ open, handleClose }) => {

    return (
        <Dialog maxWidth={"lg"} open={open == true} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                About Reports
                <IconButton onClick={handleClose} style={{ float: "right" }} clean>
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="XIcon" />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ width: "1000px" }}>
                <DialogContentText> A report is the smallest building block of your dashboard.
                    Each report runs a single Cypher query that loads data from your database.
                    By changing the report type, different visualizations can be created for the data.
                    See the <a href="https://neo4j.com/labs/neodash/2.1/user-guide/reports/">Documentation</a> for more on reports.
                    <br></br><br></br>
                    <table>
                        <tr>
                            <td>
                                <b>Moving Reports</b>
                                <img src='movereport.gif' style={{ width: "100%" }}></img>
                            </td>
                            <td>
                                <b>Resizing Reports</b>
                                <img src='resizereport.gif' style={{ width: "100%" }}></img>
                            </td>
                        </tr>
                    </table>


                </DialogContentText>


            </DialogContent>
        </Dialog>
    );
}

export default (NeoReportHelpModal);
