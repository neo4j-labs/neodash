import React, { useCallback, useState } from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardViewHeader from './CardViewHeader';
import NeoCardViewFooter from './CardViewFooter';
import NeoReport from '../../report/Report';
import { CardContent, IconButton } from '@material-ui/core';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import { CARD_FOOTER_HEIGHT, CARD_HEADER_HEIGHT } from '../../config/CardConfig';
import { downloadComponentAsImage } from '../../chart/ChartUtils';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import NeoCodeViewerComponent, { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';

const NeoCardView = ({ title, database, query, globalParameters,
    widthPx, heightPx, fields, extensions, active, setActive,
    type, selection, dashboardSettings, settings, settingsOpen, refreshRate, editable,
    onGlobalParameterUpdate, onSelectionUpdate, onToggleCardSettings, onTitleUpdate,
    onFieldsUpdate, expanded, onToggleCardExpand }) => {

  // @ts-ignore
  const reportHeader = (
    <NeoCardViewHeader
      title={title}
      editable={editable}
      description={settings.description}
      fullscreenEnabled={dashboardSettings.fullscreenEnabled}
      downloadImageEnabled={dashboardSettings.downloadImageEnabled}
      onTitleUpdate={onTitleUpdate}
      onToggleCardSettings={onToggleCardSettings}
      settings={settings}
      onDownloadImage={() => downloadComponentAsImage(ref)}
      onToggleCardExpand={onToggleCardExpand}
      expanded={expanded}
    ></NeoCardViewHeader>
  );

    // @ts-ignore
    const reportHeader = <NeoCardViewHeader
        title={title}
        editable={editable}
        description={settings.description}
        fullscreenEnabled={dashboardSettings.fullscreenEnabled}
        downloadImageEnabled={dashboardSettings.downloadImageEnabled}
        onTitleUpdate={onTitleUpdate}
        onToggleCardSettings={onToggleCardSettings}
        settings={settings}
        onDownloadImage={() => downloadComponentAsImage(ref)}
        onToggleCardExpand={onToggleCardExpand}
        expanded={expanded}
    >
    </NeoCardViewHeader>;

    // @ts-ignore
    const reportFooter = active ?
        <NeoCardViewFooter
            fields={fields}
            settings={settings}
            extensions={extensions}
            selection={selection}
            type={type}
            onSelectionUpdate={onSelectionUpdate}
            showOptionalSelections={(settings["showOptionalSelections"])} >
        </NeoCardViewFooter> : <></>;

    const reportTypes = getReportTypes(extensions);


    const withoutFooter = reportTypes[type] && reportTypes[type].withoutFooter ? reportTypes[type].withoutFooter : reportTypes[type] && !reportTypes[type].selection || (settings && settings.hideSelections);

  const getLocalParameters = (): any => {
    const re = /(?:^|\W)\$(\w+)(?!\w)/g;
    let match;
    const localQueryVariables: string[] = [];
    while ((match = re.exec(query))) {
      localQueryVariables.push(match[1]);
    }

    const getLocalParameters = (): any => {
        let re = /(?:^|\W)\$(\w+)(?!\w)/g, match, localQueryVariables: string[] = [];
        while (match = re.exec(query)) {
            localQueryVariables.push(match[1]);
        }

        if (!globalParameters) {
            return {};
        }
        return Object.fromEntries(Object.entries(globalParameters).filter(([local]) => localQueryVariables.includes(local)));
    }
    return Object.fromEntries(
      Object.entries(globalParameters).filter(([local]) => localQueryVariables.includes(local)),
    );
  };

    // TODO - understand why CardContent is throwing a warning based on this style config.
    const cardContentStyle = {
        paddingBottom: "0px", paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", width: "100%", marginTop: "-3px",
        height: expanded ? (withoutFooter ? "100%" : `calc(100% - ${CARD_FOOTER_HEIGHT}px)`) : ((withoutFooter) ? reportHeight + CARD_FOOTER_HEIGHT + "px" : reportHeight + "px"),
        overflow: "auto"
    };

    const reportContent = <CardContent ref={ref} style={cardContentStyle}>
        {active ?
            <NeoReport
                query={query}
                database={database}
                parameters={getLocalParameters()}
                extensions={extensions}
                disabled={settingsOpen}
                selection={selection}
                fields={fields}
                settings={settings}
                expanded={expanded}
                rowLimit={dashboardSettings['disableRowLimiting'] ? 1000000 : reportTypes[type] && reportTypes[type].maxRecords}
                refreshRate={refreshRate}
                dimensions={{ width: widthPx, height: heightPx }}
                type={type}
                ChartType={reportTypes[type] && reportTypes[type].component}
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

    return (
        <div className={`card-view ${expanded ? "expanded" : ""}`} style={settings && settings.backgroundColor ? { backgroundColor: settings.backgroundColor } : {}}>
            {reportHeader}
            {/* if there's no selection for this report, we don't have a footer, so the report can be taller. */}
            <ReportItemContainer style={{ height: expanded ? (withoutFooter ? "calc(100% - 69px)" : "calc(100% - 79px)") : cardHeight }}>
                {reportTypes[type] ? reportContent : <NeoCodeViewerComponent value={"Invalid report type. Are you missing an extension?"} />}
                {reportTypes[type] ? reportFooter : <></>}
            </ReportItemContainer>
        </div>
    );
};

export default NeoCardView;
