import React, { useEffect, useState } from 'react';
import { ReportItemContainer } from '../CardStyle';
import NeoCardViewHeader from './CardViewHeader';
import NeoCardViewFooter from './CardViewFooter';
import { CardContent, IconButton } from '@material-ui/core';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import { CARD_FOOTER_HEIGHT, CARD_HEADER_HEIGHT } from '../../config/CardConfig';
import { extensionEnabled, getReportTypes } from '../../extensions/ExtensionUtils';
import NeoCodeViewerComponent from '../../component/editor/CodeViewerComponent';
import { NeoReportWrapper } from '../../report/ReportWrapper';
import { identifyStyleRuleParameters } from '../../extensions/styling/StyleRuleEvaluator';
import { ThemeProvider } from '@material-ui/styles';
import { lightTheme, darkHeaderTheme, luma } from '../../component/theme/Themes';

const NeoCardView = ({
  title,
  database,
  query,
  globalParameters,
  widthPx,
  heightPx,
  fields,
  extensions,
  active,
  setActive,
  onDownloadImage,
  type,
  selection,
  dashboardSettings,
  settings,
  updateReportSetting,
  createNotification,
  settingsOpen,
  editable,
  onGlobalParameterUpdate,
  onSelectionUpdate,
  onToggleCardSettings,
  onTitleUpdate,
  onFieldsUpdate,
  expanded,
  onToggleCardExpand,
}) => {
  const reportHeight = heightPx - CARD_FOOTER_HEIGHT - CARD_HEADER_HEIGHT + 13;
  const cardHeight = heightPx - CARD_FOOTER_HEIGHT;
  const ref = React.useRef();

  const [lastRunTimestamp, setLastRunTimestamp] = useState(Date.now());

  const getLocalParameters = (parse_string): any => {
    if (!parse_string || !globalParameters) {
      return {};
    }

    let re = /(?:^|\W)\$(\w+)(?!\w)/g;
    let match;

    // If the report styling extension is enabled, extend the list of local (relevant) parameters with those used by the style rules.
    const styleRules = settings.styleRules ? settings.styleRules : [];
    const styleParams = extensionEnabled(extensions, 'styling') ? identifyStyleRuleParameters(styleRules) : [];

    let localQueryVariables: string[] = [...styleParams];
    while ((match = re.exec(parse_string))) {
      localQueryVariables.push(match[1]);
    }

    return Object.fromEntries(
      Object.entries(globalParameters).filter(([local]) => localQueryVariables.includes(local))
    );
  };

  // @ts-ignore
  const reportHeader = (
    <ThemeProvider
      theme={
        settings.backgroundColor && luma(settings.backgroundColor) < dashboardSettings.darkLuma
          ? darkHeaderTheme
          : lightTheme
      }
    >
      <NeoCardViewHeader
        title={title}
        editable={editable}
        description={settings.description}
        fullscreenEnabled={settings.fullscreenEnabled}
        downloadImageEnabled={settings.downloadImageEnabled}
        refreshButtonEnabled={settings.refreshButtonEnabled}
        onTitleUpdate={onTitleUpdate}
        onToggleCardSettings={onToggleCardSettings}
        onManualRefreshCard={() => setLastRunTimestamp(Date.now())}
        settings={settings}
        onDownloadImage={onDownloadImage}
        onToggleCardExpand={onToggleCardExpand}
        expanded={expanded}
        parameters={getLocalParameters(title)}
      ></NeoCardViewHeader>
    </ThemeProvider>
  );

  // @ts-ignore
  const reportFooter = active ? (
    <NeoCardViewFooter
      fields={fields}
      settings={settings}
      extensions={extensions}
      selection={selection}
      type={type}
      onSelectionUpdate={onSelectionUpdate}
      showOptionalSelections={settings.showOptionalSelections}
    ></NeoCardViewFooter>
  ) : (
    <></>
  );

  const localParameters = { ...getLocalParameters(query), ...getLocalParameters(settings.drilldownLink) };
  const reportTypes = getReportTypes(extensions);
  const withoutFooter =
    reportTypes[type] && reportTypes[type].withoutFooter
      ? reportTypes[type].withoutFooter
      : (reportTypes[type] && !reportTypes[type].selection) || (settings && settings.hideSelections);

  const getGlobalParameter = (key: string): any => {
    return globalParameters ? globalParameters[key] : undefined;
  };

  useEffect(() => {
    if (!settingsOpen) {
      setLastRunTimestamp(Date.now());
    }
  }, [settingsOpen, query, JSON.stringify(localParameters)]);

  // TODO - understand why CardContent is throwing a warning based on this style config.
  const cardContentStyle = {
    paddingBottom: '0px',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    width: '100%',
    marginTop: '-3px',
    height: expanded
      ? withoutFooter
        ? '100%'
        : `calc(100% - ${CARD_FOOTER_HEIGHT}px)`
      : withoutFooter
      ? `${reportHeight + CARD_FOOTER_HEIGHT}px`
      : `${reportHeight}px`,
    overflow: 'auto',
  };
  const reportContent = (
    <CardContent ref={ref} style={cardContentStyle}>
      {active ? (
        <NeoReportWrapper
          query={query}
          database={database}
          parameters={localParameters}
          lastRunTimestamp={lastRunTimestamp}
          extensions={extensions}
          disabled={settingsOpen}
          selection={selection}
          fields={fields}
          settings={settings}
          expanded={expanded}
          rowLimit={dashboardSettings.disableRowLimiting ? 1000000 : reportTypes[type] && reportTypes[type].maxRecords}
          dimensions={{ width: widthPx, height: heightPx }}
          type={type}
          ChartType={reportTypes[type] && reportTypes[type].component}
          setGlobalParameter={onGlobalParameterUpdate}
          getGlobalParameter={getGlobalParameter}
          updateReportSetting={updateReportSetting}
          createNotification={createNotification}
          queryTimeLimit={dashboardSettings.queryTimeLimit ? dashboardSettings.queryTimeLimit : 20}
          setFields={onFieldsUpdate}
        />
      ) : (
        <>
          <IconButton
            style={{ float: 'right', padding: '4px', marginRight: '12px' }}
            aria-label='run'
            onClick={() => {
              setActive(true);
            }}
          >
            <PlayCircleFilledIcon />
          </IconButton>
          <NeoCodeEditorComponent
            value={query}
            language={'cypher'}
            editable={false}
            style={{
              border: '1px solid lightgray',
              borderRight: '35px solid #eee',
              marginTop: '0px',
              marginLeft: '10px',
              marginRight: '10px',
            }}
            onChange={() => {}}
            placeholder={'No query specified...'}
          />
        </>
      )}
    </CardContent>
  );

  return (
    <div
      className={`card-view ${expanded ? 'expanded' : ''}`}
      style={settings && settings.backgroundColor ? { backgroundColor: settings.backgroundColor } : {}}
    >
      {reportHeader}
      {/* if there's no selection for this report, we don't have a footer, so the report can be taller. */}
      <ReportItemContainer
        style={{ height: expanded ? (withoutFooter ? 'calc(100% - 69px)' : 'calc(100% - 79px)') : cardHeight }}
      >
        {reportTypes[type] ? (
          reportContent
        ) : (
          <NeoCodeViewerComponent value={'Invalid report type. Are you missing an extension?'} />
        )}
        {reportTypes[type] ? reportFooter : <></>}
      </ReportItemContainer>
    </div>
  );
};

export default NeoCardView;
