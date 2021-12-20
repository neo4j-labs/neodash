
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
    try{
        useEffect(() => {
            debouncedQueryCallback && debouncedQueryCallback(query, { input: inputText }, setExtraRecords);
        }, [inputText, query]);    
    }catch(e){
        
    }

    const records = props.records;
    const query = records[0]["input"];

    if(query){
        var parameter = query.split("\n")[0].split("$")[1];
        var label = query.split("`")[1] ? query.split("`")[1] : "";
        var property = query.split("`")[3] ? query.split("`")[3] : "";
        var currentValue = props.getGlobalParameter(parameter) || "";
    } else {
        // Don't return here...
        // Will cause the application to crash.
    }

    const settings = (props.settings) ? props.settings : {};
    const clearParameterOnFieldClear = settings.clearParameterOnFieldClear;

    const [extraRecords, setExtraRecords] = React.useState([]);
    const [inputText, setInputText] = React.useState(currentValue);
    const [value, setValue] = React.useState(currentValue);
    const debouncedQueryCallback = useCallback(
        debounce(props.queryCallback, 250),
        [],
    );
 
    if (!query) {
        // For some reason can't return early in the else statement above, or application will crash.
        // Crash seems related to useState.
        // So instead just return here...
        return <p style={{margin: "15px"}}>No selection specified. Open up the report settings and choose a node label and property.</p>
    }
    
    return <div>
        <Autocomplete
            id="autocomplete"
            options={extraRecords.map(r => r["_fields"] && r["_fields"][0] !== null ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option ? option.toString() : ""}
            style={{ width: 300, marginLeft: "15px", marginTop: "5px" }}
            inputValue={inputText}
            onInputChange={(event, value) => {
                setInputText(value);
                debouncedQueryCallback(query, {input: value}, setExtraRecords);
            }}
            value={value ? value.toString() : currentValue}
            onChange={(event, newValue) => {
                setValue(newValue);
                if(newValue == null && clearParameterOnFieldClear){
                    props.setGlobalParameter(parameter, undefined);
                }else{
                    props.setGlobalParameter(parameter, newValue);
                }
            }}
            renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} placeholder="Start typing..." label={label + " " + property} variant="outlined" />}
        />

    </div>
}

export default NeoParameterSelectionChart;