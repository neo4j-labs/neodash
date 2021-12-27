
import React, { useCallback, useEffect } from 'react';
import { ChartProps } from './Chart';
import { debounce, TextareaAutosize, TextField } from '@material-ui/core';
import { QueryStatus, runCypherQuery } from "../report/CypherQueryRunner";
import NeoFieldSelection from '../component/FieldSelection';
import Autocomplete from '@material-ui/lab/Autocomplete';

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoParameterSelectionChart = (props: ChartProps) => {

    useEffect(() => {
        debouncedQueryCallback && debouncedQueryCallback(query, { input: inputText }, setExtraRecords);
    }, [inputText, query]);

    const debouncedQueryCallback = useCallback(
        debounce(props.queryCallback, 250),
        [],
    );
    const records = props.records;
    const query = records[0]["input"] ? records[0]["input"] : undefined;
    const parameter = query ? query.split("\n")[0].split("$")[1] : "$";
    
    const currentValue = (props.getGlobalParameter && props.getGlobalParameter(parameter)) ? props.getGlobalParameter(parameter) : "";
    const [extraRecords, setExtraRecords] = React.useState([]);
    const [inputText, setInputText] = React.useState(currentValue);
    const [value, setValue] = React.useState(currentValue);
    
    // In case the components gets (re)loaded with a different/non-existing selected parameter, set the text to the current global parameter value.
    if(query && value != currentValue && currentValue != inputText ){
        setValue(currentValue);
        setInputText(currentValue);
        setExtraRecords([]);
    }
    if (!query || query.trim().length == 0) {
        return <p style={{ margin: "15px" }}>No selection specified. Open up the report settings and choose a node label and property.</p>
    }

    const label = query.split("`")[1] ? query.split("`")[1] : "";
    const property = query.split("`")[3] ? query.split("`")[3] : "";
    
    const settings = (props.settings) ? props.settings : {};
    const clearParameterOnFieldClear = settings.clearParameterOnFieldClear;

    return <div>
        <Autocomplete
            id="autocomplete"
            options={extraRecords.map(r => r["_fields"] && r["_fields"][0] !== null ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option ? option.toString() : ""}
            style={{ width: 300, marginLeft: "15px", marginTop: "5px" }}
            inputValue={inputText}
            onInputChange={(event, value) => {
                setInputText(value);
                debouncedQueryCallback(query, { input: value }, setExtraRecords);
            }}
            value={value ? value.toString() : currentValue}
            onChange={(event, newValue) => {
                setValue(newValue);
                if (newValue == null && clearParameterOnFieldClear) {
                    props.setGlobalParameter(parameter, undefined);
                } else {
                    props.setGlobalParameter(parameter, newValue);
                }
            }}
            renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} placeholder="Start typing..." label={label + " " + property} variant="outlined" />}
        />

    </div>
}

export default NeoParameterSelectionChart;