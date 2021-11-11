import React, { useEffect } from "react";
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TextField } from "@material-ui/core";
import debounce from 'lodash/debounce';
import { useCallback } from 'react';

const NeoCardViewHeader = ({ title, editable, onTitleUpdate, onToggleCardSettings }) => {
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

    return <CardHeader style={{height: "72px"}}
        action={(editable) ? settingsButton : <></>}
        title={cardTitle} />
}

export default NeoCardViewHeader;

