import React, { useEffect } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { mutateName, processHierarchyFromRecords, findObject, flatten } from '../../../../chart/ChartUtils';
import { useState } from 'react';

import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { themeNivo } from '../../../../chart/Utils';
import RefreshButton from '../../component/RefreshButton';

/**
 * Embeds a TreeMap (from Charts) into NeoDash.
 */
const NeoTreeMapChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const [data, setData] = useState(undefined);
  const [commonProperties, setCommonProperties] = useState({ data: { name: 'Total', children: [] } });
  const [refreshable, setRefreshable] = useState(false);

  useEffect(() => {
    let dataPre = processHierarchyFromRecords(records, selection);
    dataPre.forEach((currentNode) => mutateName(currentNode));
    setCommonProperties({ data: dataPre.length == 1 ? dataPre[0] : { name: 'Total', children: dataPre } });
  }, [records]);

  useEffect(() => {
    setData(commonProperties.data);
  }, [props.selection, commonProperties]);

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }
  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

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

  /**
   * Helper function to determine which label to draw on a node in the hierarchy.
   * @param n  the node.
   * @returns a string (label).
   */
  const getLabelForNode = (n) => {
    return n.formattedValue;
  };

  // Final sanity check - only draw the visualization if we are sure the data is there and formatted correctly.
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
        <ResponsiveTreeMap
          {...commonProperties}
          theme={themeNivo}
          identity='name'
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
          colors={{ scheme: colorScheme }}
          label={getLabelForNode}
        />
      </div>
    </>
  );
};

export default NeoTreeMapChart;
