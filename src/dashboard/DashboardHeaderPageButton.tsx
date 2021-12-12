import React, { useCallback, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IconButton, TextField, InputBase, DialogTitle, Dialog, DialogContent, DialogContentText, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { PlayArrow } from '@material-ui/icons';
import { NeoDeletePageModal } from '../modal/DeletePageModal';
import debounce from 'lodash/debounce';

export const NeoPageButton = ({ title, index, disabled = false, selected = false, onSelect, onRemove, onTitleUpdate }) => {

    // TODO - debounce page title update
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleClose = () => {
        setModalOpen(false);
    };

    const [titleText, setTitleText] = React.useState(title);
    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (titleText !== title) {
            setTitleText(title);
        }
    }, [title])

    const content = (
        <div key={index} style={{
            padding: "5px", backgroundColor: selected ? 'white' : 'inherit', cursor: 'pointer',
            display: "inline-block", height: "100%", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd"
        }}>
            <Grid style={{ cursor: 'pointer', height: "100%" }} onClick={onSelect} container spacing={1} alignItems="flex-end">
                <Grid item key={1}>
                    <InputBase
                        value={titleText}
                        onChange={(event) => {
                            if(disabled){
                                return;
                            }
                            onTitleUpdate(event);
                            setTitleText(event.target.value);
                        }}
                        onFocus={(e) => {
                            if(disabled){
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                        readOnly={disabled}
                        inputProps={{ style: { textTransform: 'none', cursor: 'pointer', fontWeight: 'normal' } }}
                        style={{ height: "36px", width: "185px", paddingLeft: "10px", color: selected ? 'black' : '#888', textAlign: "center", textTransform: "uppercase" }}
                        placeholder="Page name..."
                    />
                </Grid>
                <Grid item key={2}>
                    {(selected && !disabled) ? <IconButton size="medium" style={{ padding: "5px", color: "white" }} aria-label="move left" onClick={() => setModalOpen(true)}>
                        <CloseIcon color="disabled" />
                    </IconButton> : <IconButton size="medium" style={{ opacity: 0, padding: "5px", color: "white" }} aria-label="move left"
                        onClick={(event) => null}>
                        <CloseIcon color="disabled" />
                    </IconButton>}

                </Grid>
            </Grid>
            <NeoDeletePageModal modalOpen={modalOpen} onRemove={onRemove} handleClose={handleClose}></NeoDeletePageModal>
        </div>
    );
    return content;
}


export default (NeoPageButton);