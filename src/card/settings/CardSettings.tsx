import React from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardSettingsHeader from './CardSettingsHeader';
import NeoCardSettingsContent from './CardSettingsContent';
import NeoCardSettingsFooter from './CardSettingsFooter';
import { CardContent } from '@material-ui/core';
import { CARD_HEADER_HEIGHT } from '../../config/CardConfig';

const NeoCardSettings = ({
  settingsOpen,
  query,
  database, // Current database related to the report
  databaseList, // List of databases the user can choose from ('system' is filtered out)
  refreshRate,
  width,
  height,
  type,
  reportSettings,
  reportSettingsOpen,
  fields,
  heightPx,
  extensions, // A set of enabled extensions.
  onQueryUpdate,
  onRefreshRateUpdate,
  onDatabaseChanged, // When the database related to a report is changed it must be stored in the report state
  onRemovePressed,
  onClonePressed,
  onReportSettingUpdate,
  onToggleCardSettings,
  onTypeUpdate,
  setActive,
  onReportHelpButtonPressed,
  onToggleReportSettings,
  dashboardSettings,
  expanded,
  onToggleCardExpand,
}) => {
  const reportHeight = heightPx - CARD_HEADER_HEIGHT + 24;

  const cardSettingsHeader = (
    <NeoCardSettingsHeader
      expanded={expanded}
      onToggleCardExpand={onToggleCardExpand}
      onRemovePressed={onRemovePressed}
      onClonePressed={onClonePressed}
      onReportHelpButtonPressed={onReportHelpButtonPressed}
      fullscreenEnabled={dashboardSettings.fullscreenEnabled}
      onToggleCardSettings={(e) => {
        setActive(reportSettings.autorun !== undefined ? reportSettings.autorun : true);
        onToggleCardSettings(e);
      }}
    />
  );

  // TODO - instead of hiding everything based on settingsopen, only hide the components that slow down render (cypher editor)
  const cardSettingsContent = settingsOpen ? (
    <NeoCardSettingsContent
      query={query}
      database={database}
      refreshRate={refreshRate}
      reportSettings={reportSettings}
      width={width}
      height={height}
      type={type}
      extensions={extensions}
      databaseList={databaseList}
      onDatabaseChanged={onDatabaseChanged}
      onQueryUpdate={onQueryUpdate}
      onReportSettingUpdate={onReportSettingUpdate}
      onRefreshRateUpdate={onRefreshRateUpdate}
      onTypeUpdate={onTypeUpdate}
    ></NeoCardSettingsContent>
  ) : (
    <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }} />
  );

  const cardSettingsFooter = settingsOpen ? (
    <NeoCardSettingsFooter
      type={type}
      fields={fields}
      extensions={extensions}
      reportSettings={reportSettings}
      reportSettingsOpen={reportSettingsOpen}
      onToggleReportSettings={onToggleReportSettings}
      onReportSettingUpdate={onReportSettingUpdate}
    ></NeoCardSettingsFooter>
  ) : (
    <div></div>
  );

  return (
    <div className={`card-view ${expanded ? 'expanded' : ''}`} style={{ overflowY: 'auto', height: '100%' }}>
      {cardSettingsHeader}
      <ReportItemContainer style={{ height: reportHeight, marginTop: '-20px' }}>
        {cardSettingsContent}
        {cardSettingsFooter}
      </ReportItemContainer>
    </div>
  );
};

export default NeoCardSettings;
