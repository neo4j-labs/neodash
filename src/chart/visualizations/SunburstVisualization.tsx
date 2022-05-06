import React from 'react'
import { ResponsiveSunburst  } from '@nivo/sunburst'
import { ChartReportProps, ExtendedChartReportProps } from './VisualizationProps'
import { checkResultKeys,  mutateName, hierarchyProcessor, findObject, flatten } from './Utils'
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator'
import { useState } from 'react'

export default function SunburstVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['index', 'key', 'value'])

    if (error !== false) {
        return <p>{error.message}</p>
    }

    const dataPre = hierarchyProcessor(records);
    dataPre.forEach(currentNode => mutateName(currentNode));

    const commonProperties = { data : dataPre.length == 1 ? dataPre[0] : {name : "Total", children : dataPre}};

    const [data, setData] = useState(commonProperties.data)
    const settings = (props.settings) ? props.settings : {};
    const legendHeight = 20;
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const enableArcLabels = (settings["enableArcLabels"] !== undefined) ? settings["enableArcLabels"] : true;
    const interactive = (settings["interactive"]) ? settings["interactive"] : true;
    const borderWidth = (settings["borderWidth"]) ? settings["borderWidth"] : 0;
    const legend = (settings["legend"]) ? settings["legend"] : false;
    const arcLabelsSkipAngle = (settings["arcLabelsSkipAngle"]) ? settings["arcLabelsSkipAngle"] : 10;
    const cornerRadius = (settings["cornerRadius"]) ? settings["cornerRadius"] : 3;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'nivo';

    return (
        <>
            <button onClick={() => setData(commonProperties.data)}>Reset</button>
            <ResponsiveSunburst
                {...commonProperties}
                id="name"
                value="loc"
                data={data}
                transitionMode={"pushIn"}
                isInteractive={interactive}
                onClick={clickedData => {
                    const foundObject = findObject(flatten(data.children), clickedData.id)
                    if (foundObject && foundObject.children) {
                        setData(foundObject)
                    }
                }}
                enableArcLabels={enableArcLabels}
                borderWidth={borderWidth}
                cornerRadius={cornerRadius}
                margin={{
                    top: marginTop,
                    right: marginRight,
                    bottom: (legend) ? legendHeight + marginBottom : marginBottom,
                    left: marginLeft
                }}
                animate={true}
                arcLabelsSkipAngle={arcLabelsSkipAngle}
                colors={{ scheme: colorScheme }}
            /></>)

}