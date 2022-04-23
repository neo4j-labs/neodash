import React, { useCallback, useState } from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardViewHeader from './CardViewHeader';
import NeoCardViewFooter from './CardViewFooter';
import NeoReport from '../../report/Report';
import { CardContent, IconButton } from '@material-ui/core';
import { REPORT_TYPES } from '../../config/ReportConfig';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { downloadComponentAsImage } from '../../chart/util/ChartUtils';

export const CARD_FOOTER_HEIGHT = 64;

const NeoCardView = ({ title, database, query, cypherParameters, globalParameters, 
    width, height, fields, active, setActive,
    type, selection, dashboardSettings, settings, settingsOpen, refreshRate, editable,
    onGlobalParameterUpdate, onSelectionUpdate, onToggleCardSettings, onTitleUpdate,
    onFieldsUpdate, expanded, onToggleCardExpand }) => {

    const reportHeight = (97 * height) + (148 * Math.floor((height - 1) / 3));
    const cardHeight = (120 * height) + (78 * Math.floor((height - 1) / 3)) - 7;
    const ref = React.useRef();

    // @ts-ignore
    const reportHeader = <NeoCardViewHeader
        title={title}
        editable={editable}
        fullscreenEnabled={dashboardSettings.fullscreenEnabled}
        downloadImageEnabled={dashboardSettings.downloadImageEnabled}
        onTitleUpdate={onTitleUpdate}
        onToggleCardSettings={onToggleCardSettings}
        settings={settings}
        onDownloadImage={()=> downloadComponentAsImage(ref)}
        onToggleCardExpand={onToggleCardExpand}
        expanded={expanded}
    >
    </NeoCardViewHeader>;

    // @ts-ignore
    const reportFooter = active ?
        <NeoCardViewFooter
            fields={fields}
            settings={settings}
            selection={selection}
            type={type}
            onSelectionUpdate={onSelectionUpdate}
            showOptionalSelections={(settings["showOptionalSelections"])} >
        </NeoCardViewFooter> : <></>;

    const withoutFooter = !REPORT_TYPES[type].selection || (settings && settings.hideSelections);

    const getGlobalParameter = (key: string): any => {
        return globalParameters ? globalParameters[key] : undefined;
    }

    const getLocalParameters = (): any => {
        let re = /(?:^|\W)\$(\w+)(?!\w)/g, match, localQueryVariables : string[] = [];
        while (match = re.exec(query)) {
            localQueryVariables.push(match[1]);
        }

        if(!globalParameters){
            return {};
        }
        return Object.fromEntries(Object.entries(globalParameters).filter(([local]) => localQueryVariables.includes(local) ));
    }

    return (
        <div className={`card-view ${expanded ? "expanded" : ""}`}>
            {reportHeader}
            {/* if there's no selection for this report, we don't have a footer, so the report can be taller. */}
            <ReportItemContainer style={{ height: expanded ? (withoutFooter ? "calc(100% - 69px)" : "calc(100% - 79px)") : cardHeight }}>
                <CardContent ref={ref}  style={{
                    paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", width: "100%", marginTop: "-3px",
                    height: expanded ? (withoutFooter ? "100%" : `calc(100% - ${CARD_FOOTER_HEIGHT}px)`) : ((withoutFooter) ? reportHeight + CARD_FOOTER_HEIGHT + "px" : reportHeight + "px"),
                    overflow: "auto", overflowY: "auto", overflowX: "auto"
                }}>
                    {active ?
                        <NeoReport query={query}
                            database={database}
                            stringParameters={cypherParameters}
                            mapParameters={getLocalParameters()}
                            disabled={settingsOpen}
                            selection={selection}
                            fields={fields}
                            settings={settings}
                            expanded={expanded}
                            rowLimit={dashboardSettings['disableRowLimiting'] ? 1000000 : REPORT_TYPES[type].maxRecords}
                            refreshRate={refreshRate}
                            dimensions={{ width: width, height: height }}
                            type={type}
                            ChartType={REPORT_TYPES[type].component}
                            setGlobalParameter={onGlobalParameterUpdate}
                            getGlobalParameter={getGlobalParameter}
                            queryTimeLimit={dashboardSettings['queryTimeLimit'] ? dashboardSettings['queryTimeLimit'] : 20}
                            setFields={onFieldsUpdate} /> :
                        <>
                            <IconButton style={{ float: "right", padding: "4px", marginRight: "12px" }} aria-label="run" onClick={(e) => { setActive(true) }}>
                                <PlayCircleFilledIcon />
                            </IconButton>
                            <NeoCodeEditorComponent value={query} language={"cypher"}
                                editable={false} style={{ border: "1px solid lightgray", borderRight: "35px solid #eee", marginTop: "0px", marginLeft: "10px", marginRight: "10px" }}
                                onChange={(value) => { }}
                                placeholder={"No query specified..."}
                            />

                        </>}
                </CardContent>
                {reportFooter}
            </ReportItemContainer>
        </div>
    );
};

export default NeoCardView;