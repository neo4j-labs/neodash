import React, { useEffect } from "react";
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import UnfoldLess from '@material-ui/icons/UnfoldLess';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import { TextField } from "@material-ui/core";
import debounce from 'lodash/debounce';
import { useCallback } from 'react';

const NeoCardViewHeader = ({ title, editable, onTitleUpdate, fullscreenEnabled, onToggleCardSettings, onToggleCardExpand, expanded }) => {
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

    const cardTitle = <TextField
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

    const settingsButton = <IconButton aria-label="settings"
        onClick={onToggleCardSettings}>
        <MoreVertIcon />
    </IconButton>

    const maximizeButton = <IconButton aria-label="maximize"
        onClick={onToggleCardExpand}>
        <FullscreenIcon />
    </IconButton>

    const unMaximizeButton = <IconButton aria-label="un-maximize"
        onClick={onToggleCardExpand}>
        <FullscreenExit />
    </IconButton>

    // const maximizeButton = <IconButton aria-label="maximize"
    //     style={{ transform: "rotate(45deg)" }}
    //     onClick={onToggleCardExpand}>
    //     <UnfoldMore />
    // </IconButton>

    // const unMaximizeButton = <IconButton aria-label="un-maximize"
    //     onClick={onToggleCardExpand}>
    //     <CloseIcon />
    // </IconButton>

    return <CardHeader style={{ height: "72px" }}
        action={<>
            {fullscreenEnabled ? (expanded ? unMaximizeButton : maximizeButton) : <></>}
            {(editable && !expanded) ? settingsButton : <></>}
        </>}
        title={cardTitle} />
}

export default NeoCardViewHeader;

