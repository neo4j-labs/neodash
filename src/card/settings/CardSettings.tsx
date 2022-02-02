import React from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardSettingsHeader from './CardSettingsHeader';
import NeoCardSettingsContent from './CardSettingsContent';
import NeoCardSettingsFooter from './CardSettingsFooter';
import { CardContent } from '@material-ui/core';

const NeoCardSettings = ({ settingsOpen, query, database, refreshRate, cypherParameters, width, height, type, reportSettings, reportSettingsOpen,
    onQueryUpdate, onSizeUpdate, onRefreshRateUpdate, onCypherParametersUpdate, onRemovePressed, onReportSettingUpdate,
    onShiftLeftPressed, onShiftRightPressed, onToggleCardSettings, onTypeUpdate, setActive,
     onToggleReportSettings, dashboardSettings, expanded, onToggleCardExpand }) => {

   
    const cardHeight = 10 + (120 * height) + (78 * Math.floor((height - 1) / 3)) + "px";

    const cardSettingsHeader = <NeoCardSettingsHeader
        expanded={expanded}
        onToggleCardExpand={onToggleCardExpand}
        onRemovePressed={onRemovePressed}
        onShiftLeftPressed={onShiftLeftPressed}
        onShiftRightPressed={onShiftRightPressed}
        fullscreenEnabled={dashboardSettings.fullscreenEnabled}
        onToggleCardSettings={(e) => { setActive(reportSettings.autorun !== undefined ? reportSettings.autorun : true); onToggleCardSettings(e) }} />

    // TODO - instead of hiding everything based on settingsopen, only hide the components that slow down render (cypher editor)
    const cardSettingsContent = (settingsOpen) ? <NeoCardSettingsContent
        query={query}
        database={database}
        refreshRate={refreshRate}
        reportSettings={reportSettings}
        cypherParameters={cypherParameters}
        width={width}
        height={height}
        type={type}
        onQueryUpdate={onQueryUpdate}
        onSizeUpdate={onSizeUpdate}
        onReportSettingUpdate={onReportSettingUpdate}
        onRefreshRateUpdate={onRefreshRateUpdate}
        onCypherParametersUpdate={onCypherParametersUpdate}
        onTypeUpdate={onTypeUpdate}></NeoCardSettingsContent> : <CardContent style={{ paddingTop: "10px", paddingBottom: "10px" }}/>;

    const cardSettingsFooter = (settingsOpen) ? <NeoCardSettingsFooter
        type={type}
        reportSettings={reportSettings}
        reportSettingsOpen={reportSettingsOpen}
        onToggleReportSettings={onToggleReportSettings}
        onReportSettingUpdate={onReportSettingUpdate}></NeoCardSettingsFooter> : <div></div>;

    return (
        <div className={`card-view ${expanded ? "expanded" : ""}`} style={{ overflowY: "auto" }}>
            {cardSettingsHeader}
            <ReportItemContainer style={{ height: cardHeight, marginTop: "-20px" }} >
                {cardSettingsContent}
                {cardSettingsFooter}
            </ReportItemContainer>
        </div>
    );
};

export default NeoCardSettings;