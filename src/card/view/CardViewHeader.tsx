import React, { useEffect } from "react";
import CardHeader from '@material-ui/core/CardHeader';
import { TextField } from "@material-ui/core";
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { Tooltip } from '@material-ui/core';
import { HeroIcon, CustomIcon, IconButton } from '@neo4j-ndl/react';

const NeoCardViewHeader = ({ title, editable, onTitleUpdate, fullscreenEnabled, downloadImageEnabled,
    onToggleCardSettings, onDownloadImage, onToggleCardExpand, expanded }) => {

    const [text, setText] = React.useState(title);

    // Ensure that we only trigger a text update event after the user has stopped typing.
    const debouncedTitleUpdate = useCallback(
        debounce(onTitleUpdate, 250),
        [],
    );

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (text !== title) {
            setText(title);
        }
    }, [title])

    const cardTitle = <>
        <table style={{width: "100%"}}>
            <tbody>
                <tr>
                    {editable ? <td>
                        <IconButton clean grouped buttonSize="large"
                            style={{ marginTop:"-8px" }}>
                            <CustomIcon
                                className="ndl-icon n-w-6 n-h-6 drag-handle"
                                iconName="Drag"
                            />
                        </IconButton>
                    </td> : <></>}
                    <td style={{ width: "100%" }}>
                        <TextField
                            id="standard-outlined"
                            className={"no-underline large"}
                            label=""
                            disabled={!editable}
                            placeholder="Report name..."
                            fullWidth
                            maxRows={4}
                            value={text}
                            onChange={(event) => {
                                setText(event.target.value);
                                debouncedTitleUpdate(event.target.value);
                            }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </>

    const settingsButton = <Tooltip title="Settings" aria-label="settings">
        <IconButton aria-label="settings"
            onClick={onToggleCardSettings} clean buttonSize="large">
            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="DotsVerticalIcon" />
        </IconButton>
    </Tooltip>

    const maximizeButton = <Tooltip title="Maximize" aria-label="maximize">
        <IconButton aria-label="maximize"
            onClick={onToggleCardExpand} clean buttonSize="large">
            <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Expand" />
        </IconButton>
    </Tooltip>

    const unMaximizeButton = <IconButton aria-label="un-maximize"
        onClick={onToggleCardExpand} clean buttonSize="large">
        <CustomIcon className="ndl-icon n-w-6 n-h-6" iconName="Shrink" />
    </IconButton>

    const downloadImageButton = <Tooltip title="Download as Image" aria-label="download">
        <IconButton onClick={onDownloadImage} aria-label="download csv"
            clean buttonSize="large">
            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="CameraIcon" />
        </IconButton>
    </Tooltip>

    return <CardHeader style={{ height: "72px" }}
        action={<>
            {(downloadImageEnabled) ? downloadImageButton : <></>}
            {fullscreenEnabled ? (expanded ? unMaximizeButton : maximizeButton) : <></>}
            {editable ? settingsButton : <></>}
        </>}
        title={cardTitle} />
}

export default NeoCardViewHeader;

