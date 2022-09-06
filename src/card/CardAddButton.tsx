import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addReportThunk } from '../page/PageThunks';
import { getReports } from '../page/PageSelectors';
import { Card, CardContent, Typography } from '@material-ui/core';
import { HeroIcon, IconButton } from '@neo4j-ndl/react';

/**
 * Button to add a new report to the current page.
 */
const NeoAddNewCard = ({ onCreatePressed }) => {
    return (
        <div>
            <Card style={{ background: "#e0e0e0" }}>
                <CardContent style={{ height: '429px' }}>
                    <Typography variant="h2" color="textSecondary" style={{ paddingTop: "155px", textAlign: "center" }}>
                        <IconButton aria-label="add report"
                            onClick={() => {
                                onCreatePressed();
                            }}
                            floating >
                            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="ViewGridAddIcon" />
                        </IconButton>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAddNewCard);