
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Badge from '@material-ui/core/Badge';


export const NeoAboutModal = ({ open, handleClose }) => {
    const app = "NeoDash - Neo4j Dashboard Builder";
    const email = "niels.dejong@neo4j.com";
    const version = "2.0.2";

    return (
        <div>
            <Dialog maxWidth={"lg"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    About NeoDash
                    <IconButton onClick={handleClose} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div style={{ color: "rgba(0, 0, 0, 0.84)" }} class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary">
                        NeoDash is a dashboard builder for the Neo4j graph database.<br />
                        If you can write Cypher queries, you can build a dashboard in minutes.
                        <hr></hr>
                        <h3 style={{ marginBottom: "5px" }}>Core Features</h3>
                        <ul>
                            <li>An editor to write and execute <a target="_blank" href="https://neo4j.com/developer/cypher/">Cypher</a> queries.</li>
                            <li>Use results of your Cypher queries to create tables, bar charts, graph visualizations, and more.</li>
                            <li>Style your reports, group them together in pages, and add interactivity between reports.</li>
                            <li>Save and share your dashboards with your friends.</li>
                        </ul>
                        No connectors or data pre-processing needed, it works directly with Neo4j!
                        <hr></hr>
                        <h3 style={{ marginBottom: "5px" }}>Getting Started</h3>
                        You will automatically start with an empty dashboard when starting up NeoDash for this first time.<br />
                        Click the <strong>(<LibraryBooksIcon style={{ paddingTop: "5px" }} fontSize="small" /> Documentation)</strong> button to see some example queries and visualizations.
                        <hr></hr>
                        <h3 style={{ marginBottom: "5px" }}>Extending NeoDash</h3>
                        NeoDash is built with React and <a target="_blank" href="https://github.com/adam-cowley/use-neo4j">use-neo4j</a>,
                        It uses <a target="_blank" href="https://github.com/neo4j-labs/charts">charts</a> to power some of the visualizations. <br />
                        You can also extend NeoDash with your own visualizations. Check out the developer guide in the <a target="_blank" href="https://github.com/nielsdejong/neodash/"> project repository</a>.
                        <hr></hr>
                        <h3 style={{ marginBottom: "5px" }}>Contact</h3>
                        For suggestions, feature requests and other feedback: contact the project's maintainer(s) via the Github repository, <br />
                        or by e-mail at <a href={"mailto:" + email}>{email}</a>.
                        <br />
                        <hr></hr>
                        <i style={{ float: "right", fontSize: "11px" }}>v{version}</i>
                    </div></DialogContent>
            </Dialog>
        </div >
    );
}

export default (NeoAboutModal);


