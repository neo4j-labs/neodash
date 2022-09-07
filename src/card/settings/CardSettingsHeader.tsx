import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import { Tooltip } from '@material-ui/core';
import { HeroIcon } from '@neo4j-ndl/react';
import { CustomIcon, IconButton } from '@neo4j-ndl/react';

const NeoCardSettingsHeader = ({ onRemovePressed, onToggleCardSettings, onToggleCardExpand, 
    expanded, fullscreenEnabled, onReportHelpButtonPressed, onClonePressed }) => {
    const maximizeButton = <IconButton aria-label="maximize"
        onClick={onToggleCardExpand} clean buttonSize="large">
        <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Expand" />
    </IconButton>

    const unMaximizeButton = <IconButton aria-label="un-maximize"
        onClick={onToggleCardExpand} clean>
        <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Shrink" />
    </IconButton>

    return (
        <CardHeader
            avatar={<div style={{ marginTop:"-8px", paddingBottom:"1px" }}>
                <IconButton clean grouped buttonSize="large">
                    <CustomIcon className="ndl-icon n-w-6 n-h-6 drag-handle"
                        iconName="Drag"/>
                </IconButton>
                <Tooltip title="Help" aria-label="help">
                    <IconButton aria-label="help"
                        onClick={onReportHelpButtonPressed} clean buttonSize="large">
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="QuestionMarkCircleIcon" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" aria-label="delete">
                    <IconButton style={{ color: "red" }} aria-label="remove"
                        onClick={onRemovePressed} clean buttonSize="large">
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="TrashIcon" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Clone" aria-label="clone">
                    <IconButton style={{ color: "green" }} aria-label="clone"
                        onClick={onClonePressed} clean buttonSize="large">
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DuplicateIcon" />
                    </IconButton>
                </Tooltip>
            </div>}
            action={<>
                {fullscreenEnabled ? (expanded ? unMaximizeButton : maximizeButton) : <></>}
                <Tooltip title="Save" aria-label="save">
                    <IconButton aria-label="save" onClick={(e) => { e.preventDefault(); onToggleCardSettings() }}
                        clean buttonSize="large">
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="PlayIcon" />
                    </IconButton>
                </Tooltip >
            </>}
            title=""
            subheader="" />
    );
};

export default NeoCardSettingsHeader;