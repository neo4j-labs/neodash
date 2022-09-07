import React, { useContext } from 'react';
import { Divider, FormControl, InputLabel, ListItem, ListItemIcon, ListItemText, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from "use-neo4j/dist/neo4j.context";
import { SELECTION_TYPES } from '../config/ReportConfig';
import NeoSetting from '../component/field/Setting';
import { loadDashboardListFromNeo4jThunk, loadDatabaseListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { HeroIcon, Button, IconButton, Dialog } from '@neo4j-ndl/react';

const shareBaseURL = "http://neodash.graphapp.io";
const styles = {

};

export const NeoShareModal = ({ connection, loadDashboardListFromNeo4j, loadDatabaseListFromNeo4j }) => {

    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
    const [loadFromFileModalOpen, setLoadFromFileModalOpen] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const { driver } = useContext<Neo4jContextState>(Neo4jContext);

    // One of [null, database, file]
    const [shareType, setShareType] = React.useState("database");
    const [shareID, setShareID] = React.useState(null);
    const [shareName, setShareName] = React.useState(null);
    const [shareFileURL, setShareFileURL] = React.useState("");
    const [shareConnectionDetails, setShareConnectionDetails] = React.useState("No");
    const [shareStandalone, setShareStandalone] = React.useState("No");
    const [shareLink, setShareLink] = React.useState(null);


    const [dashboardDatabase, setDashboardDatabase] = React.useState("neo4j");
    const [databases, setDatabases] = React.useState(["neo4j"]);

    const handleClickOpen = () => {
        setShareID(null);
        setShareLink(null);
        setShareModalOpen(true);
        loadDatabaseListFromNeo4j(driver, (result) => { setDatabases(result) });
    };

    const handleClose = () => {
        setShareModalOpen(false);
    };


    const columns = [
        { field: 'id', hide: true, headerName: 'ID', width: 150 },
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'title', headerName: 'Title', width: 270 },
        { field: 'author', headerName: 'Author', width: 160 },
        {
            field: 'load', headerName: ' ', renderCell: (c) => {
                return <Button onClick={(e) => {
                    setShareID(c.id);
                    setShareName(c.row.title);
                    setShareType("database");
                    setLoadFromNeo4jModalOpen(false)
                }} style={{ float: "right", backgroundColor: "white" }} variant="contained" size="medium" endIcon={<PlayArrow />}>Select</Button>
            }, width: 120
        },
    ]

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ShareIcon" />
                </ListItemIcon>
                <ListItemText primary="Share" />
            </ListItem>

            <Dialog size="large" open={shareModalOpen == true} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ShareIcon"
                    style={{ display: "inline", marginRight: "5px", marginBottom: "5px" }} />
                Share Dashboard

                </Dialog.Header>
                <Dialog.Content>
                    This window lets you create a temporary share link for your dashboard.
                    Keep in mind that share links are not intended as a way to publish your dashboard for users, see the <a href="https://neo4j.com/labs/neodash/2.1/user-guide/publishing/">documentation</a> for more on publishing.
                    <br />
                    <hr /><br />
                    Step 1: Select a dashboard to share.
                    <br />
                    <br />
                    <div style={{ marginBottom: "10px" }}>
                        <Button
                            onClick={(e) => {
                                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => { setShareLink(null); setRows(result) });
                                setLoadFromNeo4jModalOpen(true);
                            }}
                            fill="outlined"
                            color="neutral"
                            floating>
                            Share from Neo4j
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DatabaseIcon" />
                        </Button>
                        <Button
                            onClick={(e) => {
                                setLoadFromFileModalOpen(true);
                            }}
                            fill="outlined"
                            color="neutral"
                            style={{ marginLeft: "10px" }}
                            floating>
                            Share a file
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DocumentDuplicateIcon" />
                        </Button>
                    </div>

                    <b>{shareID ? "Selected dashboard: " + shareName : ""}</b>
                    <hr />
                    {shareID ? <>
                        <br />
                        Step 2: Configure sharing settings.
                        <br />
                        <br />
                        <NeoSetting key={"credentials"} name={"credentials"}
                            value={shareConnectionDetails}
                            type={SELECTION_TYPES.LIST}
                            style={{ marginLeft: "0px", width: "100%", marginBottom: "10px" }}
                            helperText={"Share the dashboard including your Neo4j credentials."}
                            label={"Include Connection Details"}
                            defaultValue={"No"}
                            choices={["Yes", "No"]}
                            onChange={(e) => {
                                if (e == "No" & shareStandalone == "Yes") {
                                    return;
                                }
                                setShareLink(null);
                                setShareConnectionDetails(e)
                            }}
                        />
                        <NeoSetting key={"standalone"} name={"standalone"}
                            value={shareStandalone}
                            style={{ marginLeft: "0px", width: "100%", marginBottom: "10px" }}
                            type={SELECTION_TYPES.LIST}
                            helperText={"Share the dashboard as a standalone webpage, without the NeoDash editor."}
                            label={"Standalone Dashboard"}
                            defaultValue={"No"}
                            choices={["Yes", "No"]}
                            onChange={(e) => {
                                setShareLink(null);
                                setShareStandalone(e);
                                if (e == "Yes") {
                                    setShareConnectionDetails("Yes")
                                }
                            }}
                        />
                        <Button
                            onClick={(e) => {
                                setShareLink((shareBaseURL + "/?share&type=" + shareType + "&id=" + encodeURIComponent(shareID) + "&dashboardDatabase=" + encodeURIComponent(dashboardDatabase) +
                                    (shareConnectionDetails == "Yes" ? "&credentials=" + encodeURIComponent(connection.protocol + "://"
                                        + connection.username + ":" + connection.password + "@" + connection.database + ":" + connection.url + ":" + connection.port) : "")
                                    + (shareStandalone == "Yes" ? "&standalone=" + shareStandalone : "")));
                            }}
                            fill="outlined"
                            color="neutral"
                            floating>
                            Generate Link
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="LinkIcon" />
                        </Button>
                        <hr /></> : <></>}
                    {shareLink ? <>
                        <br />
                        Step 3: Use the generated link to view the dashboard:<br />
                        <a href={shareLink} target="_blank">{shareLink}</a><br />

                    </> : <></>}
                </Dialog.Content>
            </Dialog>
            <Dialog size="large" open={loadFromNeo4jModalOpen == true} onClose={(e) => { setLoadFromNeo4jModalOpen(false) }} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                    Select from Neo4j
                </Dialog.Header>
                <Dialog.Content>
                    Choose a dashboard to share below.

                    <div style={{ height: "380px" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                            components={{
                                ColumnSortedDescendingIcon: () => <></>,
                                ColumnSortedAscendingIcon: () => <></>,
                            }}
                        /></div>
                    <FormControl style={{ marginTop: "-58px", marginLeft: "10px" }}>
                        <InputLabel id="demo-simple-select-label">Database</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{ width: "150px" }}
                            value={dashboardDatabase}
                            onChange={(e) => {
                                setRows([]);
                                setDashboardDatabase(e.target.value);
                                loadDashboardListFromNeo4j(driver, e.target.value, (result) => { setRows(result); });
                            }}
                        >
                            {databases.map(database => {
                                return <MenuItem value={database}>{database}</MenuItem>
                            })}
                        </Select>
                    </FormControl>

                </Dialog.Content>
            </Dialog>
            <Dialog size="large" open={loadFromFileModalOpen == true} onClose={(e) => { setLoadFromFileModalOpen(false) }} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                    Select from URL
                </Dialog.Header>
                <Dialog.Content>
                    To share a dashboard file directly, make it accessible <a target="_blank" href="https://gist.github.com/">online</a>.
                    Then, paste the direct link here:
                    <NeoSetting key={"url"} name={"url"}
                        value={shareFileURL}
                        style={{ marginLeft: "0px", width: "100%", marginBottom: "10px" }}
                        type={SELECTION_TYPES.TEXT}
                        helperText={"Make sure the URL starts with http:// or https://."}
                        label={""}
                        defaultValue="https://gist.githubusercontent.com/username/0a78d80567f23072f06e03005cf53bce/raw/f97cc..."
                        onChange={(e) => {
                            setShareFileURL(e);
                        }}
                    />
                    <div style={{ marginBottom: "10px" }}>
                        <Button
                            onClick={(e) => {
                                setShareID(shareFileURL);
                                setShareName(shareFileURL.substring(0, 100) + "...");
                                setShareType("file");
                                setShareLink(null);
                                setShareFileURL("");
                                setLoadFromFileModalOpen(false);
                            }}
                            style={{ marginBottom: "10px"}}
                            color="success">
                            Confirm URL
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog>
        </div>
    );
}


const mapStateToProps = state => ({
    connection: applicationGetConnection(state)
});

const mapDispatchToProps = dispatch => ({
    loadDashboardListFromNeo4j: (driver, database, callback) => dispatch(loadDashboardListFromNeo4jThunk(driver, database, callback)),
    loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoShareModal));



