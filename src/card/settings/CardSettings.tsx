import React from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardSettingsHeader from './CardSettingsHeader';
import NeoCardSettingsContent from './CardSettingsContent';
import NeoCardSettingsFooter from './CardSettingsFooter';
import { CardContent } from '@mui/material';
import { CARD_HEADER_HEIGHT } from '../../config/CardConfig';

const NeoCardSettings = ({
  settingsOpen,
  pagenumber,
  reportId,
  query,
  database, // Current database related to the report
  databaseList, // List of databases the user can choose from ('system' is filtered out)
  width,
  height,
  type,
  reportSettings,
  reportSettingsOpen,
  fields,
  schema,
  heightPx,
  extensions, // A set of enabled extensions.
  onQueryUpdate,
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
  const reportHeight = heightPx - CARD_HEADER_HEIGHT + 19;

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
      pagenumber={pagenumber}
      reportId={reportId}
      query={query}
      database={database}
      reportSettings={reportSettings}
      width={width}
      height={height}
      type={type}
      extensions={extensions}
      databaseList={databaseList}
      onDatabaseChanged={onDatabaseChanged}
      onQueryUpdate={onQueryUpdate}
      onReportSettingUpdate={onReportSettingUpdate}
      onTypeUpdate={onTypeUpdate}
      forceRunQuery={onToggleCardSettings}
    ></NeoCardSettingsContent>
  ) : (
    <CardContent className='n-py-2' />
  );

  const cardSettingsFooter = settingsOpen ? (
    <NeoCardSettingsFooter
      type={type}
      fields={fields}
      schema={schema}
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
    <div
      className={`card-view n-bg-palette-neutral-bg-weak n-text-palette-neutral-text-default ${
        expanded ? 'expanded' : ''
      } n-overflow-y-auto n-h-full`}
    >
      {cardSettingsHeader}
      <ReportItemContainer style={{ height: reportHeight }} className='-n-mt-2'>
        {cardSettingsContent}
        {cardSettingsFooter}
      </ReportItemContainer>
    </div>
  );
};

export default NeoCardSettings;
