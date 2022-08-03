import React from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import {  ExtendedChartReportProps } from './VisualizationProps'
import {
    checkResultKeys,
    recordToNative
} from './Utils'
import { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh';
import { globeFeature, colombiaFeature } from '../util/ChoroplethFeatures'

export default function ChroplethMapVisualization(props: ExtendedChartReportProps) {
    const { records, first } = props

    if (!first) {
        return <p>Loading data...</p>
    }

    const error = checkResultKeys(first, ['index', 'key', 'value'])

    if (error !== false) {
        return <p>{error.message}</p>
    }

    let data = records.reduce((data: Record<string, any>, row: Record<string, any>) => {

        try {
            const index = recordToNative(row.get('index'));
            const value = recordToNative(row.get('value'));
            data.push({ "id" : index, "value" : value });
            return data
        } catch(e) {
            console.error(e);
            return [];
        }
    }, []);

    let m = Math.max(...data.map(o => o.value));

    //const [data, setData] = useState(commonProperties.data);
    const [refreshable, setRefreshable] = useState(false);
    const settings = (props.settings) ? props.settings : {};
    const marginRight = (settings["marginRight"]) ? settings["marginRight"] : 24;
    const marginLeft = (settings["marginLeft"]) ? settings["marginLeft"] : 24;
    const marginTop = (settings["marginTop"]) ? settings["marginTop"] : 24;
    const marginBottom = (settings["marginBottom"]) ? settings["marginBottom"] : 40;
    const interactive = (settings["interactive"]) ? settings["interactive"] : true;
    const borderWidth = (settings["borderWidth"]) ? settings["borderWidth"] : 0;
    const legend = (settings["legend"]) ? settings["legend"] : true;
    const colorScheme = (settings["colors"]) ? settings["colors"] : 'nivo';
    const projectionScale = (settings["projectionScale"]) ? settings["projectionScale"] : 100;
    const projectionTranslationX = (settings["projectionTranslationX"]) ? settings["projectionTranslationX"] : 0.5;
    const projectionTranslationY = (settings["projectionTranslationY"]) ? settings["projectionTranslationY"] : 0.5;
    const labelProperty = (settings["labelProperty"]) ? settings["labelProperty"] : "properties.name";


    //TODO Apply certain logic to determine different map features to display
    const feature = globeFeature;

    return (
        <>
            <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
                <ResponsiveChoropleth
                    data = {data}
                    isInteractive={interactive}
                    features = {feature.features}
                    domain={[ 0, m ]}
                    margin={{ top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }}
                    colors={colorScheme}
                    unknownColor="#666666"
                    label= { labelProperty }
                    valueFormat=".2s"
                    projectionScale={projectionScale}
                    projectionTranslation={[ projectionTranslationX, projectionTranslationY ]}
                    projectionRotation={[ 0, 0, 0 ]}
                    enableGraticule={true}
                    graticuleLineColor="#dddddd"
                    borderWidth={borderWidth}
                    borderColor="#152538"
                    legends={legend ? [
                        {
                            anchor: 'bottom-left',
                            direction: 'column',
                            justify: true,
                            translateX: 20,
                            translateY: -100,
                            itemsSpacing: 0,
                            itemWidth: 94,
                            itemHeight: 18,
                            itemDirection: 'left-to-right',
                            itemTextColor: '#444444',
                            itemOpacity: 0.85,
                            symbolSize: 18,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000000',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ] : []}
                />
            </div>
        </>)

}