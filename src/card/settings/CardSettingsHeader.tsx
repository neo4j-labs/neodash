import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import { HeroIcon } from '@neo4j-ndl/react';
import { CustomIcon } from '@neo4j-ndl/react';

const NeoCardSettingsHeader = ({ onRemovePressed, onToggleCardSettings, onToggleCardExpand, 
    expanded, fullscreenEnabled, onReportHelpButtonPressed, onClonePressed }) => {
    const maximizeButton = <IconButton aria-label="maximize"
        onClick={onToggleCardExpand}>
        <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Expand" />
    </IconButton>

    const unMaximizeButton = <IconButton aria-label="un-maximize"
        onClick={onToggleCardExpand}>
        <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Shrink" />
    </IconButton>

    return (
        <CardHeader
            avatar={<div>

                <CustomIcon className="ndl-icon n-w-6 n-h-6 drag-handle"
                    iconName="Drag"
                    color="grey"
                    style={{ cursor: "pointer", marginLeft: "-7px", marginBottom: "-5px" }}/>
                <Tooltip title="Help" aria-label="help">
                    <IconButton size="medium" style={{ marginTop: "-38px", marginLeft: "20px", padding: "8px" }} aria-label="help"
                        onClick={onReportHelpButtonPressed}>
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="QuestionMarkCircleIcon" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" aria-label="delete">
                    <IconButton size="medium" style={{ marginTop: "-38px", padding: "8px", color: "red" }} aria-label="remove"
                        onClick={onRemovePressed} >
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="TrashIcon" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Clone" aria-label="clone">
                    <IconButton size="medium" style={{ marginTop: "-38px", padding: "8px", color: "green" }} aria-label="clone"
                                onClick={onClonePressed} >
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DuplicateIcon" />
                    </IconButton>
                </Tooltip>
            </div>}
            action={<>
                {fullscreenEnabled ? (expanded ? unMaximizeButton : maximizeButton) : <></>}
                <Tooltip title="Save" aria-label="save">
                    <IconButton aria-label="save" onClick={(e) => { e.preventDefault(); onToggleCardSettings() }}>
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                    </IconButton>
                </Tooltip >
            </>}
            title=""
            subheader="" />
    );
};

export default NeoCardSettingsHeader;