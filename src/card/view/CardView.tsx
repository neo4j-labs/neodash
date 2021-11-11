import React from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardViewHeader from './CardViewHeader';
import NeoCardViewFooter from './CardViewFooter';
import NeoReport from '../../report/Report';
import { CardContent } from '@material-ui/core';
import { REPORT_TYPES, SELECTION_TYPES } from '../../config/ReportConfig';

const CARD_FOOTER_HEIGHT = 64;

const NeoCardView = ({ title, database, query, cypherParameters, globalParameters, width, height, fields,
    type, selection, settings, settingsOpen, refreshRate, editable,
    onGlobalParameterUpdate, onSelectionUpdate, onToggleCardSettings, onTitleUpdate, onFieldsUpdate }) => {
    const reportHeight = (97 * height) + (148 * Math.floor((height - 1) / 3));
    const cardHeight = (120 * height) + (78 * Math.floor((height - 1) / 3)) - 7;

    // @ts-ignore
    const reportHeader = <NeoCardViewHeader
        title={title}
        editable={editable}
        onTitleUpdate={onTitleUpdate}
        onToggleCardSettings={onToggleCardSettings}>
    </NeoCardViewHeader>;

    // @ts-ignore
    const reportFooter = <NeoCardViewFooter
        fields={fields}
        settings={settings}
        selection={selection}
        type={type}
        onSelectionUpdate={onSelectionUpdate}
        showOptionalSelections={(settings["showOptionalSelections"])} >
    </NeoCardViewFooter>;

    return (
        <div>
            {reportHeader}
            {/* if there's no selection for this report, we don't have a footer, so the report can be taller. */}
            <ReportItemContainer style={{ height: cardHeight }}>
                <CardContent style={{
                    paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", width: "100%", marginTop: "-3px",
                    height: (!REPORT_TYPES[type].selection || (settings && settings.hideSelections)) ?  reportHeight + CARD_FOOTER_HEIGHT + "px" : reportHeight + "px", overflow: "auto", overflowY: "auto", overflowX: "auto"
                }}>
                    <NeoReport query={query}
                        database={database}
                        stringParameters={cypherParameters}
                        mapParameters={globalParameters}
                        disabled={settingsOpen}
                        selection={selection}
                        fields={fields}
                        settings={settings}
                        rowLimit={REPORT_TYPES[type].maxRecords}
                        refreshRate={refreshRate}
                        dimensions={{ width: width, height: height }}
                        type={type}
                        ChartType={REPORT_TYPES[type].component}
                        setGlobalParameter={onGlobalParameterUpdate}
                        setFields={onFieldsUpdate} />
                </CardContent>
                {reportFooter}
            </ReportItemContainer>
        </div>
    );
};


export default NeoCardView;
