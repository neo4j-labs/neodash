import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { ListItem, ListItemIcon, ListItemText, TextareaAutosize } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import StorageIcon from '@material-ui/icons/Storage';
import { loadDashboardThunk } from '../dashboard/DashboardThunks';
/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

const styles = {

};

export const NeoLoadModal = ({ loadDashboard }) => {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleCloseAndLoad = () => {
        setOpen(false);
        loadDashboard(text);
        setText("");
    };

    const reader = new FileReader();
    reader.onload = async (e) => {
        setText(e.target.result);
    };

    const uploadDashboard = async (e) => {
        e.preventDefault();
        reader.readAsText(e.target.files[0]);

    }

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <IconButton style={{ padding: "0px" }} >
                        <SystemUpdateAltIcon />
                    </IconButton>
                </ListItemIcon>
                <ListItemText primary="Load" />
            </ListItem>

            <Dialog maxWidth={"lg"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <SystemUpdateAltIcon style={{
                        height: "30px",
                        paddingTop: "4px",
                        marginBottom: "-8px",
                        marginRight: "5px",
                        paddingBottom: "5px"
                    }} />   Load Dashboard
                    <IconButton onClick={handleClose} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>

                </DialogTitle>
                <DialogContent style={{ width: "1000px" }}>
                    {/* <DialogContentText> Paste your dashboard file here to load it into NeoDash.</DialogContentText> */}
                    <div>
                        <Button
                            component="label"
                            // onClick={(e)=>uploadDashboard(e)}
                            style={{ backgroundColor: "white", marginBottom: "10px" }}
                            color="default"
                            variant="contained"
                            size="medium"
                            endIcon={<PostAddIcon />}>
                            <input
                                type="file"
                                onChange={(e) => uploadDashboard(e)}
                                hidden
                            />
                            Select File
                        </Button>
                        <Button
                            component="label"
                            // onClick={(e)=>uploadDashboard(e)}
                            style={{ marginLeft: "10px", marginBottom: "10px", backgroundColor: "white" }}
                            color="default"
                            variant="contained"
                            size="medium"
                            endIcon={<StorageIcon />}>
                            <input
                                type="file"
                                onChange={(e) => uploadDashboard(e)}
                                hidden
                            />
                            Select From Neo4j
                        </Button>
                        <Button onClick={(text.length > 0) ? handleCloseAndLoad : null}
                            style={{ color: text.length > 0 ? "white" : "lightgrey", float: "right", marginLeft: "10px", marginBottom: "10px", backgroundColor: text.length > 0 ? "green" : "white" }}
                            color="default"
                            variant="contained"
                            size="medium"
                            endIcon={<PlayArrow />}>
                            Load Dashboard
                        </Button>
                    </div>


                    <TextareaAutosize
                        style={{ minHeight: "500px", width: "100%", border: "1px solid lightgray" }}
                        className={"textinput-linenumbers"}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        aria-label=""
                        placeholder="Select a dashboard first, then preview it here..." />

                </DialogContent>
                {/* <DialogActions> */}
                {/* </DialogActions> */}
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    loadDashboard: text => dispatch(loadDashboardThunk(text)),
});

//  
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoLoadModal));



