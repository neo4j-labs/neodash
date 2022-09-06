import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { HeroIcon, IconButton, Button } from '@neo4j-ndl/react';
/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

const styles = {

};

export const NeoLoadSharedDashboardModal = ({ shareDetails, onResetShareDetails, onConfirmLoadSharedDashboard }) => {

    const handleClose = () => {
        onResetShareDetails();
    };

    return (
        <div>
            <Dialog maxWidth={"lg"} open={shareDetails !== undefined} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="AdjustmentsIcon"
                        style={{ display: "inline", marginRight: "5px", marginBottom: "5px" }} />
                    Loading Dashboard
                    <IconButton onClick={handleClose} style={{ float: "right" }} clean>
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="XIcon" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {shareDetails !== undefined ? <>
                        You are loading a Neo4j dashboard.<br />
                        {shareDetails && shareDetails.url ? <>You will be connected to <b>{shareDetails && shareDetails.url}</b>.</> : <>You will still need to specify a connection manually.</>}
                        <br /> <br />
                        This will override your current dashboard (if any). Continue?
                        </> : <><br/><br/><br/></>}
                        <br/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <Button
                            onClick={handleClose}
                            style={{ float: "right" }}>
                            Cancel
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ReplyIcon" />
                        </Button>
                        <Button
                            onClick={e => {
                                onConfirmLoadSharedDashboard();
                            }}
                            style={{ float: "right", marginRight: "5px" }}>
                            Continue
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                        </Button>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoLoadSharedDashboardModal));



