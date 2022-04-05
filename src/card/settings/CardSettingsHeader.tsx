import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { FullscreenExit } from '@material-ui/icons';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const NeoCardSettingsHeader = ({ onRemovePressed, onToggleCardSettings, onToggleCardExpand, expanded, fullscreenEnabled }) => {
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
                <IconButton aria-label="save" onClick={(e) => { e.preventDefault(); onToggleCardSettings() }}><MoreVertIcon /></IconButton> 
            </>}
            title=""
            subheader="" />
    );
};

export default NeoCardSettingsHeader;