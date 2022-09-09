import React, { useContext, useRef } from 'react';
import { FormControl, InputLabel, ListItem, ListItemIcon, ListItemText, MenuItem, Select, TextareaAutosize } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { loadDashboardFromNeo4jByUUIDThunk, loadDashboardListFromNeo4jThunk, loadDashboardThunk, loadDatabaseListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from "use-neo4j/dist/neo4j.context";
import { HeroIcon, Button, Dialog, Dropdown } from "@neo4j-ndl/react";

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

const styles = {

};

export const NeoLoadModal = ({ loadDashboard, loadDatabaseListFromNeo4j, loadDashboardFromNeo4j, loadDashboardListFromNeo4j }) => {
    const [loadModalOpen, setLoadModalOpen] = React.useState(false);
    const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
    const [text, setText] = React.useState("");
    const [rows, setRows] = React.useState([]);
    const { driver } = useContext<Neo4jContextState>(Neo4jContext);
    const [dashboardDatabase, setDashboardDatabase] = React.useState("neo4j");
    const [databases, setDatabases] = React.useState(["neo4j"]);
    const loadFromFile = useRef(null);

    const handleClickOpen = () => {
        setLoadModalOpen(true);
    };

    const handleClose = () => {
        setLoadModalOpen(false);
    };


    const handleCloseAndLoad = () => {
        setLoadModalOpen(false);
        loadDashboard(text);
        setText("");
    };

    function handleDashboardLoadedFromNeo4j(result) {
        setText(result);
        setLoadFromNeo4jModalOpen(false);
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        setText(e.target.result);
    };

    const uploadDashboard = async (e) => {
        e.preventDefault();
        reader.readAsText(e.target.files[0]);
    }

    const columns = [
        { field: 'id', hide: true, headerName: 'ID', width: 150 },
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'title', headerName: 'Title', width: 270 },
        { field: 'author', headerName: 'Author', width: 160 },
        { field: 'version', headerName: 'Version', width: 85 },
        {
            field: 'load', headerName: 'Select', renderCell: (c) => {
                return <Button onClick={(e) => { loadDashboardFromNeo4j(driver, dashboardDatabase, c.id, handleDashboardLoadedFromNeo4j) }}
                            style={{ float: "right" }}
                            fill="outlined"
                            color="neutral"
                            floating>
                                Select
                                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                        </Button>
            }, width: 130
        },
    ]


    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="CloudUploadIcon" />
                </ListItemIcon>
                <ListItemText primary="Load" />
            </ListItem>

            <Dialog size="large" open={loadModalOpen == true} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="CloudUploadIcon"
                    style={{ display: "inline", marginRight: "5px", marginBottom: "5px" }} />
                Load Dashboard

                </Dialog.Header>
                <Dialog.Content>
                    <div style={{ marginBottom: "10px" }}>
                        <Button
                            onClick={(e) => {
                                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => { setRows(result) });
                                setLoadFromNeo4jModalOpen(true);
                                loadDatabaseListFromNeo4j(driver, (result) => { setDatabases(result) });
                            }}
                            fill="outlined"
                            color="neutral"
                            floating>
                            Select from Neo4j
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DatabaseIcon" />
                        </Button>
                        <Button
                            onClick={(e) => {loadFromFile.current.click()}}
                            fill="outlined"
                            color="neutral"
                            style={{ marginLeft: "10px" }}
                            floating>
                            <input
                                type="file"
                                ref={loadFromFile}
                                onChange={(e) => uploadDashboard(e)}
                                hidden
                            />
                            Select from file
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DocumentAddIcon" />
                        </Button>

                        <Button onClick={(text.length > 0) ? handleCloseAndLoad : null}
                            style={{ float: "right", color: text.length > 0 ? "white" : "lightgrey", backgroundColor: text.length > 0 ? "green" : "white" }}
                            fill="outlined"
                            floating>
                            Load Dashboard
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                        </Button>
                    </div>


                    <TextareaAutosize
                        style={{ minHeight: "500px", width: "100%", border: "1px solid lightgray" }}
                        className={"textinput-linenumbers"}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        aria-label=""
                        placeholder="Select a dashboard first, then preview it here..." />

                </Dialog.Content>
            </Dialog>
            <Dialog size="large" open={loadFromNeo4jModalOpen == true} onClose={(e) => { setLoadFromNeo4jModalOpen(false) }} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                    Select from Neo4j
                </Dialog.Header>
                <Dialog.Subtitle>
                    If dashboards are saved in your current database, choose a dashboard below.
                </Dialog.Subtitle>
                <Dialog.Content>
                    <div style={{ height: "380px", borderBottom: "1px solid lightgrey" }}>
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
                    <Dropdown id="database"
                        onChange={(newValue) => {
                            setRows([]);
                            setDashboardDatabase(newValue.value);
                            loadDashboardListFromNeo4j(driver, newValue.value, (result) => { setRows(result); });
                        }}
                        options={databases.map((database) => (
                            { label: database, value: database }
                        ))}
                        value={{label: dashboardDatabase, value: dashboardDatabase}}
                        label="Database"
                        type="select"
                        style={{ width: "150px" }}>
                    </Dropdown>
                </Dialog.Content>
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    loadDashboard: text => dispatch(loadDashboardThunk(text)),
    loadDashboardFromNeo4j: (driver, database, uuid, callback) => dispatch(loadDashboardFromNeo4jByUUIDThunk(driver, database, uuid, callback)),
    loadDashboardListFromNeo4j: (driver, database, callback) => dispatch(loadDashboardListFromNeo4jThunk(driver, database, callback)),
    loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoLoadModal));



