import React from 'react';
import { Button, HeroIcon, Dialog } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDeletePageModal = ({modalOpen, onRemove, handleClose}) => {

    return (
        <Dialog size="small" open={modalOpen == true} onClose={handleClose} aria-labelledby="form-dialog-title">
            <Dialog.Header id="form-dialog-title">
                Delete page?
            </Dialog.Header>
            <Dialog.Subtitle>
                Are you sure you want to remove this page? This cannot be undone.
            </Dialog.Subtitle>
            <Dialog.Actions>
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
            </Dialog.Actions>
        </Dialog>
    );
}

export default (NeoDeletePageModal);
