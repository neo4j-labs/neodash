
import React from 'react';
import { ChartProps } from './Chart';

/**
 * Renders an iFrame provided by the user.
 */
const NeoIFrameChart = (props: ChartProps) => {
    const [extraRecords, setExtraRecords] = React.useState([]);
    // Records are overridden to be a single element array with a field called 'input'.
    const records = props.records;
    const parameters = props.parameters ? props.parameters : {};
    const passGlobalParameters = props?.settings?.passGlobalParameters
    const url = records[0]["input"];

    // Replaces all global dashboard parameters inside a string with their values.
    function replaceDashboardParameters(str) {
        if(!str) return "";
        Object.keys(parameters).forEach(key => {
            str = str.replaceAll("$" + key, parameters[key]);
        });
        return str;
    }

    if (!url || !(url.startsWith("http://") || url.startsWith("https://"))) {
        return <p style={{ margin: "15px" }}>Invalid iFrame URL. Make sure your url starts with <code>http://</code> or <code>https://</code>.</p>
    }

    const mapParameters = records[0]["mapParameters"] || {};
    const queryString = Object.keys(mapParameters).map(key => key + '=' + mapParameters[key]).join('&');
    return <iframe style={{ width: "100%", border: "none", marginBottom: "-5px", height: "100%", overflow: "hidden" }} src={replaceDashboardParameters(url) + (passGlobalParameters ? "#" + queryString : "")} />;
}

export default NeoIFrameChart;