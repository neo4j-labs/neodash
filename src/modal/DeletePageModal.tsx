import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, HeroIcon } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDeletePageModal = ({modalOpen, onRemove, handleClose}) => {

    return (
        <Dialog maxWidth={"lg"} open={modalOpen == true} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                Delete page?
            </DialogTitle>
            <DialogContent>
                <DialogContentText> Are you sure you want to remove this page? This cannot be undone.</DialogContentText>
                <Button onClick={() => {
                    handleClose();
                }}
                    fill="outlined"
                    style={{ float: "right" }}>
                        Cancel
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ReplyIcon" />
                </Button>
                <Button
                    onClick={() => {
                        onRemove();
                        handleClose();
                    }}
                    color="danger"
                    style={{ float: "right", marginRight: "5px" }}>
                        Remove
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="TrashIcon" />
                    </Button>
            </DialogContent>
        </Dialog>
    );
}

export default (NeoDeletePageModal);
