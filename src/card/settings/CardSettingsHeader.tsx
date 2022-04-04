import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChevronRight from '@material-ui/icons/ChevronRight';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { FullscreenExit } from '@material-ui/icons';
import InfoIcon from '@material-ui/icons/Info';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const NeoCardSettingsHeader = ({ onRemovePressed, onShiftLeftPressed, onShiftRightPressed,
    onToggleCardSettings, onToggleCardExpand, expanded, fullscreenEnabled }) => {
    const maximizeButton = <IconButton aria-label="maximize"
        onClick={onToggleCardExpand}>
        <FullscreenIcon />
    </IconButton>

    const unMaximizeButton = <IconButton aria-label="un-maximize"
        onClick={onToggleCardExpand}>
        <FullscreenExit />
    </IconButton>

    return (
        <CardHeader
            avatar={<div style={{ marginTop: "-8px" }}>

                <DragIndicatorIcon className="drag-handle" style={{ color: "grey", cursor: "pointer", marginTop: "8px", marginLeft: "-7px", marginRight: "10px" }}></DragIndicatorIcon>
                <IconButton size="medium" style={{ marginTop: "-16px", padding: "8px" }} aria-label="help"
                    onClick={(e) => alert("help!")}>
                    <HelpOutlineIcon />
                </IconButton>
                <IconButton size="medium" style={{ marginTop: "-16px", padding: "8px", color: "red"}} aria-label="remove"
                    onClick={onRemovePressed} >
                    <DeleteOutlineIcon />
                </IconButton>
              
            </div>}
            action={<>
                {fullscreenEnabled ? (expanded ? unMaximizeButton : maximizeButton) : <></>}
                <IconButton aria-label="save" onClick={(e) => { e.preventDefault(); onToggleCardSettings() }}><SaveIcon /></IconButton> 
            </>}
            title=""
            subheader="" />
    );
};

export default NeoCardSettingsHeader;