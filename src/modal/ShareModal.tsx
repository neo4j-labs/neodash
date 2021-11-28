import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { DialogContentText, Divider, ListItem, ListItemIcon, ListItemText, TextareaAutosize } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import StorageIcon from '@material-ui/icons/Storage';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from "use-neo4j/dist/neo4j.context";
import ShareIcon from '@material-ui/icons/Share';
import { SELECTION_TYPES } from '../config/ReportConfig';
import ReportSetting from '../component/ReportSetting';
import { loadDashboardListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { applicationGetConnection } from '../application/ApplicationSelectors';

const shareBaseURL = "http://neodash.graphapp.io";
const styles = {

};

export const NeoShareModal = ({ connection, loadDashboardListFromNeo4j }) => {

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

    const handleClickOpen = () => {
        setShareID(null);
        setShareLink(null);
        setShareModalOpen(true);
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
                }} style={{ float: "right" }} variant="contained" size="medium" endIcon={<PlayArrow />}>Select</Button>
            }, width: 120
        },
    ]

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <IconButton style={{ padding: "0px" }} >
                        <ShareIcon />
                    </IconButton>
                </ListItemIcon>
                <ListItemText primary="Share" />
            </ListItem>

            <Dialog maxWidth={"lg"} open={shareModalOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <ShareIcon style={{
                        height: "30px",
                        paddingTop: "4px",
                        marginBottom: "-8px",
                        marginRight: "5px",
                        paddingBottom: "5px"
                    }} />   Share Dashboard
                    <IconButton onClick={handleClose} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>

                </DialogTitle>
                <DialogContent style={{ width: "1000px" }}>
                    <DialogContentText>
                        Step 1: Select a dashboard to share.
                        <br />
                        <br />
                        <Button
                            component="label"
                            onClick={(e) => {
                                loadDashboardListFromNeo4j(driver, (result) => { setShareLink(null); setRows(result) });
                                setLoadFromNeo4jModalOpen(true);
                            }}
                            style={{  marginBottom: "10px", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="medium"
                            endIcon={<StorageIcon />}>
                            Share From Neo4j
                        </Button>
                        <Button
                            component="label"
                            onClick={(e) => {
                                setLoadFromFileModalOpen(true);
                            }}
                            style={{ marginBottom: "10px", marginLeft: "10px", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="medium"
                            endIcon={<PostAddIcon />}>
                            Share a File
                        </Button>

                        <br />
                        <b>{shareID ? "Selected dashboard: " + shareName : ""}</b>
                    </DialogContentText>
                    <Divider />
                    {shareID ? <><DialogContentText>
                        <br />
                        Step 2: Configure sharing settings.
                        <br />
                        <br />
                        <ReportSetting key={"credentials"} name={"credentials"}
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
                        <ReportSetting key={"standalone"} name={"standalone"}
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
                            component="label"
                            onClick={(e) => {
                                setShareLink((shareBaseURL + "/?share&type=" + shareType + "&id=" + encodeURIComponent(shareID) +
                                    (shareConnectionDetails == "Yes" ? "&credentials=" + encodeURIComponent(connection.protocol + "://"
                                        + connection.username + ":" + connection.password + "@" + connection.url + ":" + connection.port) : "")
                                    + (shareStandalone == "Yes" ? "&standalone=" + shareStandalone : "")).toLowerCase());
                            }}
                            style={{ marginBottom: "10px", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="medium">
                            Generate Link
                        </Button>
                    </DialogContentText>
                        <Divider /></> : <></>}
                    {shareLink ? <DialogContentText>
                        <br />
                        Step 3: Use the generated link to view the dashboard:<br />
                        <a href={shareLink} target="_blank">{shareLink}</a><br />

                    </DialogContentText> : <></>}
                </DialogContent>
            </Dialog>
            <Dialog maxWidth={"lg"} open={loadFromNeo4jModalOpen} onClose={(e) => { setLoadFromNeo4jModalOpen(false) }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Select From Neo4j
                    <IconButton onClick={(e) => { setLoadFromNeo4jModalOpen(false) }} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ width: "800px" }}>
                    <DialogContentText>Choose a dashboard to share below.
                    </DialogContentText>

                    <div style={{ height: "360px" }}>
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

                </DialogContent>
            </Dialog>
            <Dialog maxWidth={"lg"} open={loadFromFileModalOpen} onClose={(e) => { setLoadFromFileModalOpen(false) }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Select from URL
                    <IconButton onClick={(e) => { setLoadFromFileModalOpen(false) }} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ width: "1000px" }}>
                    <DialogContentText>
                        To share a dashboard file directly, make it accessible <a target="_blank" href="https://gist.github.com/">online</a>.
                        Then, paste the direct link here:
                        <ReportSetting key={"url"} name={"url"}
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
                        <Button
                            component="label"
                            onClick={(e) => {
                                setShareID(shareFileURL);
                                setShareName(shareFileURL.substring(0,100) + "...");
                                setShareType("file");
                                setShareLink(null);
                                setShareFileURL("");
                                setLoadFromFileModalOpen(false);
                            }}
                            style={{ marginBottom: "10px", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="medium">
                            Confirm URL
                        </Button>
                    </DialogContentText>



                </DialogContent>
            </Dialog>
        </div>
    );
}


const mapStateToProps = state => ({
    connection: applicationGetConnection(state)
});

const mapDispatchToProps = dispatch => ({
    loadDashboardListFromNeo4j: (driver, callback) => dispatch(loadDashboardListFromNeo4jThunk(driver, callback))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoShareModal));



