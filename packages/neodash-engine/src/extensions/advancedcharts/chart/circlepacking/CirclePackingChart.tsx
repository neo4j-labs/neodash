import React, { useEffect } from 'react';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { useState } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { mutateName, processHierarchyFromRecords, findObject, flatten } from '../../../../chart/ChartUtils';
import { themeNivo } from '../../../../chart/Utils';
import RefreshButton from '../../component/RefreshButton';

/**
 * Embeds a CirclePackaging (from Charts) into NeoDash.
 */
const NeoCirclePackingChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const [data, setData] = useState(undefined);
  const [commonProperties, setCommonProperties] = useState({ data: { name: 'Total', children: [] } });
  const [refreshable, setRefreshable] = useState(false);

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

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
  const interactive = settings.interactive ? settings.interactive : true;
  const borderWidth = settings.borderWidth ? settings.borderWidth : 0;
  const legend = settings.legend ? settings.legend : false;
  const colorScheme = settings.colors ? settings.colors : 'nivo';
  const showLabels = settings.showLabels !== undefined ? settings.showLabels : true;

  /**
   * Helper function to decide whether to show labels for a specific node in the hierarchy,
   * @param n - the entity
   * @returns a boolean
   */
  const showLabelsForNode = (n) => {
    return n.node.height == 0;
  };

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
        <ResponsiveCirclePacking
          {...commonProperties}
          theme={themeNivo}
          id='name'
          value='loc'
          data={data}
          onClick={(clickedData) => {
            const foundObject = findObject(flatten(data.children), clickedData.id);
            if (foundObject && foundObject.children) {
              setData(foundObject);
              setRefreshable(true);
            }
          }}
          isInteractive={interactive}
          borderWidth={borderWidth}
          margin={{
            top: marginTop,
            right: marginRight,
            bottom: legend ? legendHeight + marginBottom : marginBottom,
            left: marginLeft,
          }}
          animate={true}
          enableLabels={showLabels}
          labelsFilter={showLabelsForNode}
          colors={{ scheme: colorScheme }}
        />
      </div>
    </>
  );
};

export default NeoCirclePackingChart;
