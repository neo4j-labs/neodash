import React, { useState, useEffect } from 'react';
import { processHierarchyFromRecords, findObject, flatten, mutateName } from '../../../../chart/ChartUtils';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { themeNivo } from '../../../../chart/Utils';
import RefreshButton from '../../component/RefreshButton';
/**
 * Embeds a SunburstChart (from Charts) into NeoDash.
 */
const NeoSunburstChart = (props: ChartProps) => {
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }
  const { records } = props;
  const { selection } = props;
  const [data, setData] = useState(undefined);
  const [commonProperties, setCommonProperties] = useState({ data: { name: 'Total', children: [] } });
  const [refreshable, setRefreshable] = useState(false);

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  useEffect(() => {
    let dataPre = processHierarchyFromRecords(records, selection);
    dataPre.forEach((currentNode) => mutateName(currentNode));
    setCommonProperties({ data: dataPre.length == 1 ? dataPre[0] : { name: 'Total', children: dataPre } });
  }, [records]);

  useEffect(() => {
    setData(commonProperties.data);
  }, [props.selection, commonProperties]);

  // Where a user give us the hierarchy with a common root, in that case we can push the entire tree.
  // Where a user give us just the tree starting one hop away from the root.
  // as Nivo needs a common root, so in that case, we create it for them.
  if (data == undefined) {
    setData(commonProperties.data);
  }

  const settings = props.settings ? props.settings : {};
  const legendHeight = 20;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 24;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const enableArcLabels = settings.enableArcLabels !== undefined ? settings.enableArcLabels : true;
  const interactive = settings.interactive ? settings.interactive : true;
  const borderWidth = settings.borderWidth ? settings.borderWidth : 0;
  const legend = settings.legend !== undefined ? settings.legend : false;
  const arcLabelsSkipAngle = settings.arcLabelsSkipAngle ? settings.arcLabelsSkipAngle : 10;
  const cornerRadius = settings.cornerRadius ? settings.cornerRadius : 3;
  const colorScheme = settings.colors ? settings.colors : 'nivo';
  const inheritColorFromParent = settings.inheritColorFromParent !== undefined ? settings.inheritColorFromParent : true;

  if (!data || !data.children || data.children.length == 0) {
    return <NoDrawableDataErrorMessage />;
  }
  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
        {refreshable ? (
          <RefreshButton
            onClick={() => {
              setData(commonProperties.data);
              setRefreshable(false);
            }}
          ></RefreshButton>
        ) : (
          <div></div>
        )}
        <ResponsiveSunburst
          {...commonProperties}
          theme={themeNivo}
          id='name'
          value='loc'
          data={data}
          transitionMode={'pushIn'}
          isInteractive={interactive}
          onClick={(clickedData) => {
            const foundObject = findObject(flatten(data.children), clickedData.id);
            if (foundObject && foundObject.children) {
              setData(foundObject);
              setRefreshable(true);
            }
          }}
          enableArcLabels={enableArcLabels}
          borderWidth={borderWidth}
          cornerRadius={cornerRadius}
          inheritColorFromParent={inheritColorFromParent}
          margin={{
            top: marginTop,
            right: marginRight,
            bottom: legend ? legendHeight + marginBottom : marginBottom,
            left: marginLeft,
          }}
          childColor={{
            from: 'color',
            modifiers: [['brighter', 0.4]],
          }}
          animate={true}
          arcLabelsSkipAngle={arcLabelsSkipAngle}
          colors={{ scheme: colorScheme }}
        />
      </div>
    </>
  );
};

export default NeoSunburstChart;
