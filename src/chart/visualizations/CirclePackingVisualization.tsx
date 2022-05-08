import React from 'react'
import { ResponsiveCirclePacking   } from '@nivo/circle-packing'
import { ChartReportProps, ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys,  mutateName, processHierarchyFromRecords, findObject, flatten } from './Utils'
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator'
import { useState } from 'react'


export default function CirclePackingVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['index', 'key', 'value'])

    if (error !== false) {
        return <p>{error.message}</p>
    }
    const dataPre = processHierarchyFromRecords(records);
    dataPre.forEach(currentNode => mutateName(currentNode));

    // Where a user give us the hierarchy with a common root, in that case we can push the entire tree.
    // Where a user give us just the tree starting one hop away from the root. 
    // as Nivo needs a common root, so in that case, we create it for them.
    const commonProperties = { data : dataPre.length == 1 ? dataPre[0] : {name : "Total", children : dataPre}};

    const [data, setData] = useState(commonProperties.data)
    const settings = (props.settings) ? props.settings : {};
    const legendHeight = 20;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const interactive = (settings["interactive"]) ? settings["interactive"] : true;
    const borderWidth = (settings["borderWidth"]) ? settings["borderWidth"] : 0;
    const legend = (settings["legend"]) ? settings["legend"] : false;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'nivo';

    return (
        <>
            <button onClick={() => setData(commonProperties.data)}>Reset</button>
            <ResponsiveCirclePacking
                {...commonProperties}
                id="name"
                value="loc"
                data={data}
                onClick={clickedData => {
                    const foundObject = findObject(flatten(data.children), clickedData.id)
                    if (foundObject && foundObject.children) {
                        setData(foundObject)
                    }
                }}
                isInteractive={interactive}
                borderWidth={borderWidth}
                margin={{
                    top: marginTop,
                    right: marginRight,
                    bottom: (legend) ? legendHeight + marginBottom : marginBottom,
                    left: marginLeft
                }}
                animate={true}
                colors={{ scheme: colorScheme }}
                /></>)

}