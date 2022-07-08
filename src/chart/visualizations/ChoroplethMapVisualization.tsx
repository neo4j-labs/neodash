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

    const dataTestChoropleth = [
        {
            "id": "AFG",
            "value": 12911
        },
        {
            "id": "AGO",
            "value": 557137
        },
        {
            "id": "ALB",
            "value": 276127
        },
        {
            "id": "ARE",
            "value": 548923
        },
        {
            "id": "ARG",
            "value": 481459
        },
        {
            "id": "ARM",
            "value": 942449
        },
        {
            "id": "ATA",
            "value": 709384
        },
        {
            "id": "ATF",
            "value": 809341
        },
        {
            "id": "AUT",
            "value": 138837
        },
        {
            "id": "AZE",
            "value": 473677
        },
        {
            "id": "BDI",
            "value": 211985
        },
        {
            "id": "BEL",
            "value": 519949
        },
        {
            "id": "BEN",
            "value": 467078
        },
        {
            "id": "BFA",
            "value": 773771
        },
        {
            "id": "BGD",
            "value": 591541
        },
        {
            "id": "BGR",
            "value": 624526
        },
        {
            "id": "BHS",
            "value": 932974
        },
        {
            "id": "BIH",
            "value": 527518
        },
        {
            "id": "BLR",
            "value": 824051
        },
        {
            "id": "BLZ",
            "value": 754173
        },
        {
            "id": "BOL",
            "value": 367272
        },
        {
            "id": "BRN",
            "value": 400323
        },
        {
            "id": "BTN",
            "value": 735249
        },
        {
            "id": "BWA",
            "value": 109578
        },
        {
            "id": "CAF",
            "value": 553774
        },
        {
            "id": "CAN",
            "value": 826350
        },
        {
            "id": "CHE",
            "value": 193159
        },
        {
            "id": "CHL",
            "value": 613960
        },
        {
            "id": "CHN",
            "value": 409778
        },
        {
            "id": "CIV",
            "value": 612839
        },
        {
            "id": "CMR",
            "value": 360135
        },
        {
            "id": "COG",
            "value": 866308
        },
        {
            "id": "COL",
            "value": 245168
        },
        {
            "id": "CRI",
            "value": 842088
        },
        {
            "id": "CUB",
            "value": 672
        },
        {
            "id": "-99",
            "value": 409202
        },
        {
            "id": "CYP",
            "value": 800529
        },
        {
            "id": "CZE",
            "value": 426396
        },
        {
            "id": "DEU",
            "value": 700886
        },
        {
            "id": "DJI",
            "value": 645132
        },
        {
            "id": "DNK",
            "value": 656858
        },
        {
            "id": "DOM",
            "value": 461575
        },
        {
            "id": "DZA",
            "value": 891436
        },
        {
            "id": "ECU",
            "value": 848018
        },
        {
            "id": "EGY",
            "value": 598788
        },
        {
            "id": "ERI",
            "value": 629821
        },
        {
            "id": "ESP",
            "value": 826465
        },
        {
            "id": "EST",
            "value": 44517
        },
        {
            "id": "ETH",
            "value": 930071
        },
        {
            "id": "FIN",
            "value": 810116
        },
        {
            "id": "FJI",
            "value": 281346
        },
        {
            "id": "FLK",
            "value": 658799
        },
        {
            "id": "FRA",
            "value": 782613
        },
        {
            "id": "GAB",
            "value": 376490
        },
        {
            "id": "GBR",
            "value": 626975
        },
        {
            "id": "GEO",
            "value": 382481
        },
        {
            "id": "GHA",
            "value": 104478
        },
        {
            "id": "GIN",
            "value": 350130
        },
        {
            "id": "GMB",
            "value": 548574
        },
        {
            "id": "GNB",
            "value": 964177
        },
        {
            "id": "GNQ",
            "value": 276800
        },
        {
            "id": "GRC",
            "value": 650829
        },
        {
            "id": "GTM",
            "value": 541132
        },
        {
            "id": "GUY",
            "value": 436868
        },
        {
            "id": "HND",
            "value": 41374
        },
        {
            "id": "HRV",
            "value": 463248
        },
        {
            "id": "HTI",
            "value": 380543
        },
        {
            "id": "HUN",
            "value": 312026
        },
        {
            "id": "IDN",
            "value": 225483
        },
        {
            "id": "IND",
            "value": 33876
        },
        {
            "id": "IRL",
            "value": 163310
        },
        {
            "id": "IRN",
            "value": 625945
        },
        {
            "id": "IRQ",
            "value": 218664
        },
        {
            "id": "ISL",
            "value": 545746
        },
        {
            "id": "ISR",
            "value": 355731
        },
        {
            "id": "ITA",
            "value": 872580
        },
        {
            "id": "JAM",
            "value": 152374
        },
        {
            "id": "JOR",
            "value": 116485
        },
        {
            "id": "JPN",
            "value": 439593
        },
        {
            "id": "KAZ",
            "value": 173188
        },
        {
            "id": "KEN",
            "value": 278981
        },
        {
            "id": "KGZ",
            "value": 761812
        },
        {
            "id": "KHM",
            "value": 247435
        },
        {
            "id": "OSA",
            "value": 953195
        },
        {
            "id": "KWT",
            "value": 979238
        },
        {
            "id": "LAO",
            "value": 278549
        },
        {
            "id": "LBN",
            "value": 175905
        },
        {
            "id": "LBR",
            "value": 198534
        },
        {
            "id": "LBY",
            "value": 357229
        },
        {
            "id": "LKA",
            "value": 530903
        },
        {
            "id": "LSO",
            "value": 701053
        },
        {
            "id": "LTU",
            "value": 59036
        },
        {
            "id": "LUX",
            "value": 723534
        },
        {
            "id": "LVA",
            "value": 32843
        },
        {
            "id": "MAR",
            "value": 675414
        },
        {
            "id": "MDA",
            "value": 234230
        },
        {
            "id": "MDG",
            "value": 8627
        },
        {
            "id": "MEX",
            "value": 338710
        },
        {
            "id": "MKD",
            "value": 274646
        },
        {
            "id": "MLI",
            "value": 734002
        },
        {
            "id": "MMR",
            "value": 659546
        },
        {
            "id": "MNE",
            "value": 163362
        },
        {
            "id": "MNG",
            "value": 301037
        },
        {
            "id": "MOZ",
            "value": 200704
        },
        {
            "id": "MRT",
            "value": 776839
        },
        {
            "id": "MWI",
            "value": 947924
        },
        {
            "id": "MYS",
            "value": 156865
        },
        {
            "id": "NAM",
            "value": 607344
        },
        {
            "id": "NCL",
            "value": 262487
        },
        {
            "id": "NER",
            "value": 165909
        },
        {
            "id": "NGA",
            "value": 2836
        },
        {
            "id": "NIC",
            "value": 437592
        },
        {
            "id": "NLD",
            "value": 467069
        },
        {
            "id": "NOR",
            "value": 683472
        },
        {
            "id": "NPL",
            "value": 230746
        },
        {
            "id": "NZL",
            "value": 344821
        },
        {
            "id": "OMN",
            "value": 149449
        },
        {
            "id": "PAK",
            "value": 426197
        },
        {
            "id": "PAN",
            "value": 814297
        },
        {
            "id": "PER",
            "value": 928690
        },
        {
            "id": "PHL",
            "value": 740575
        },
        {
            "id": "PNG",
            "value": 816012
        },
        {
            "id": "POL",
            "value": 831384
        },
        {
            "id": "PRI",
            "value": 846758
        },
        {
            "id": "PRT",
            "value": 908841
        },
        {
            "id": "PRY",
            "value": 612084
        },
        {
            "id": "QAT",
            "value": 468777
        },
        {
            "id": "ROU",
            "value": 434132
        },
        {
            "id": "RUS",
            "value": 300203
        },
        {
            "id": "RWA",
            "value": 569936
        },
        {
            "id": "ESH",
            "value": 464036
        },
        {
            "id": "SAU",
            "value": 540508
        },
        {
            "id": "SDN",
            "value": 265370
        },
        {
            "id": "SDS",
            "value": 563124
        },
        {
            "id": "SEN",
            "value": 477886
        },
        {
            "id": "SLB",
            "value": 555924
        },
        {
            "id": "SLE",
            "value": 47872
        },
        {
            "id": "SLV",
            "value": 735344
        },
        {
            "id": "ABV",
            "value": 783609
        },
        {
            "id": "SOM",
            "value": 471455
        },
        {
            "id": "SRB",
            "value": 178637
        },
        {
            "id": "SUR",
            "value": 182503
        },
        {
            "id": "SVK",
            "value": 535508
        },
        {
            "id": "SVN",
            "value": 520578
        },
        {
            "id": "SWZ",
            "value": 534782
        },
        {
            "id": "SYR",
            "value": 302178
        },
        {
            "id": "TCD",
            "value": 906440
        },
        {
            "id": "TGO",
            "value": 364128
        },
        {
            "id": "THA",
            "value": 875488
        },
        {
            "id": "TJK",
            "value": 463968
        },
        {
            "id": "TKM",
            "value": 832740
        },
        {
            "id": "TLS",
            "value": 574022
        },
        {
            "id": "TTO",
            "value": 695990
        },
        {
            "id": "TUN",
            "value": 616926
        },
        {
            "id": "TUR",
            "value": 860801
        },
        {
            "id": "TWN",
            "value": 716268
        },
        {
            "id": "TZA",
            "value": 711233
        },
        {
            "id": "UGA",
            "value": 605076
        },
        {
            "id": "UKR",
            "value": 897510
        },
        {
            "id": "URY",
            "value": 656816
        },
        {
            "id": "USA",
            "value": 720893
        },
        {
            "id": "UZB",
            "value": 55222
        },
        {
            "id": "VEN",
            "value": 663909
        },
        {
            "id": "VNM",
            "value": 796808
        },
        {
            "id": "VUT",
            "value": 699028
        },
        {
            "id": "PSE",
            "value": 441499
        },
        {
            "id": "YEM",
            "value": 705070
        },
        {
            "id": "ZAF",
            "value": 823227
        },
        {
            "id": "ZMB",
            "value": 64372
        },
        {
            "id": "ZWE",
            "value": 390543
        },
        {
            "id": "KOR",
            "value": 673056
        }
    ];

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

    const dataCol = [
        {
            "id":"wy467dw9492.1",
            "value" : 15
        }
    ];

    //data = dataCol;

    let m = Math.max(...data.map(o => o.value));

    //const [data, setData] = useState(commonProperties.data);
    const [refreshable, setRefreshable] = useState(false);
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
    const projectionScale = (settings["projectionScale"]) ? settings["projectionScale"] : 100;
    const projectionTranslationX = (settings["projectionTranslationX"]) ? settings["projectionTranslationX"] : 0.5;
    const projectionTranslationY = (settings["projectionTranslationY"]) ? settings["projectionTranslationY"] : 0.5;
    const labelProperty = (settings["labelProperty"]) ? settings["labelProperty"] : "properties.name";
    const countrySpec = (settings["countrySpec"]) ? settings["countrySpec"] : "";

    const feature = countrySpec == "COL" ? colombiaFeature : globeFeature;

    return (
        <>
            <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
                {refreshable ? <Tooltip title="Reset" aria-label="reset">
                    <RefreshIcon onClick={() => { setRefreshable(false);}}
                            style={{ fontSize: "1.3rem", opacity: 0.6, bottom: 12, right: 12, position: "absolute", borderRadius: "12px", zIndex: 5, background: "#eee" }}
                            color="disabled" fontSize="small">
                    </RefreshIcon>
                </Tooltip> : <div/>
                }
                <ResponsiveChoropleth
                    //data={dataTestChoropleth}
                    data = {data}
                    features = {feature.features}
                    domain={[ 0, m ]}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    animate={true}
                    colors="YlOrRd"
                    //label = { getLabelForNode }
                    unknownColor="#666666"
                    label= { labelProperty }
                    valueFormat=".2s"
                    projectionScale={projectionScale}
                    projectionTranslation={[ projectionTranslationX, projectionTranslationY ]}
                    projectionRotation={[ 0, 0, 0 ]}
                    enableGraticule={true}
                    graticuleLineColor="#dddddd"
                    borderWidth={0.5}
                    borderColor="#152538"
                    legends={[
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
                    ]}
                />
            </div>
        </>)

}