import React from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardSettingsHeader from './CardSettingsHeader';
import NeoCardSettingsContent from './CardSettingsContent';
import NeoCardSettingsFooter from './CardSettingsFooter';
import { CardContent } from '@material-ui/core';
import { CARD_HEADER_HEIGHT } from '../../config/CardConfig';

const NeoCardSettings = ({ settingsOpen, query, database, refreshRate, width, height, type, 
    reportSettings, reportSettingsOpen, fields, widthPx, heightPx,
    onQueryUpdate, onRefreshRateUpdate, onRemovePressed, onReportSettingUpdate,
    onToggleCardSettings, onTypeUpdate, setActive,
     onToggleReportSettings, dashboardSettings, expanded, onToggleCardExpand, onCreateNotification }) => {

    const reportHeight = heightPx - CARD_HEADER_HEIGHT + 24;

    const cardSettingsHeader = <NeoCardSettingsHeader
        expanded={expanded}
        onToggleCardExpand={onToggleCardExpand}
        onRemovePressed={onRemovePressed}
        fullscreenEnabled={dashboardSettings.fullscreenEnabled}
        onToggleCardSettings={(e) => { setActive(reportSettings.autorun !== undefined ? reportSettings.autorun : true); onToggleCardSettings(e) }} />

    // TODO - instead of hiding everything based on settingsopen, only hide the components that slow down render (cypher editor)
    const cardSettingsContent = (settingsOpen) ? <NeoCardSettingsContent
        query={query}
        database={database}
        refreshRate={refreshRate}
        reportSettings={reportSettings}
        width={width}
        height={height}
        type={type}
        onQueryUpdate={onQueryUpdate}
        onReportSettingUpdate={onReportSettingUpdate}
        onRefreshRateUpdate={onRefreshRateUpdate}
        onTypeUpdate={onTypeUpdate}></NeoCardSettingsContent> : <CardContent style={{ paddingTop: "10px", paddingBottom: "10px" }}/>;

    const cardSettingsFooter = (settingsOpen) ? <NeoCardSettingsFooter
        type={type}
        fields={fields}
        reportSettings={reportSettings}
        reportSettingsOpen={reportSettingsOpen}
        onToggleReportSettings={onToggleReportSettings}
        onCreateNotification={onCreateNotification}
        onReportSettingUpdate={onReportSettingUpdate}></NeoCardSettingsFooter> : <div></div>;

    return (
        <div className={`card-view ${expanded ? "expanded" : ""}`} style={{ overflowY: "auto", height: "100%"  }}>
            {cardSettingsHeader}
            <ReportItemContainer style={{ height: reportHeight, marginTop: "-20px" }} >
                {cardSettingsContent}
                {cardSettingsFooter}
            </ReportItemContainer>
        </div>
    );
};

export default NeoCardSettings;