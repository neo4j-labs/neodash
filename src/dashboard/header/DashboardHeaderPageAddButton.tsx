import React from 'react';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import { HeroIcon } from '@neo4j-ndl/react';

export const NeoPageAddButton = ({onClick}) => {
    const content = (
        <div style={{
            padding: "5px", cursor: 'pointer',
            display: "inline-block", borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd"
        }}>
            <Grid style={{ cursor: 'pointer', height: "100%" }} container spacing={1} alignItems="flex-end">
                <Grid item>
                    <IconButton size="medium" style={{  padding: "5px" }} aria-label="move left"
                        onClick={onClick}>
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="PlusIcon" />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
    return content;
}


export default (NeoPageAddButton);