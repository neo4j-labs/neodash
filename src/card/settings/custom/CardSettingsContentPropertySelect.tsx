
import React, { useCallback, useContext } from 'react';
import { REPORT_TYPES, RUN_QUERY_DELAY_MS } from '../../../config/ReportConfig';
import { QueryStatus, runCypherQuery } from '../../../report/CypherQueryRunner';
import { Neo4jContext, Neo4jContextState } from "use-neo4j/dist/neo4j.context";
import { debounce, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import NeoFieldSelection from '../../../component/FieldSelection';

const NeoCardSettingsContentPropertySelect = ({ type, database, query, onQueryUpdate }) => {
    const { driver } = useContext<Neo4jContextState>(Neo4jContext);
    if (!driver) throw new Error('`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?')

    const debouncedRunCypherQuery = useCallback(
        debounce(runCypherQuery, RUN_QUERY_DELAY_MS),
        [],
    );


    const [labelInputText, setLabelInputText] = React.useState(undefined);
    const [labelValue, setLabelValue] = React.useState(undefined);
    const [labelRecords, setLabelRecords] = React.useState([]);
    const [propertyInputText, setPropertyInputText] = React.useState(undefined);
    const [propertyValue, setPropertyValue] = React.useState(undefined);
    const [parameterName, setParameterName] = React.useState("");
    const [propertyRecords, setPropertyRecords] = React.useState([]);

    const [id, setId] = React.useState("");
    // Define query callback to allow reports to get extra data on interactions.

    const queryCallback = useCallback(
        (query, parameters, setRecords) => {
            debouncedRunCypherQuery(driver, database, query, parameters, {}, [], 10,
                (status) => { status == QueryStatus.NO_DATA ? setRecords([]) : null },
                (result => setRecords(result)),
                () => { return }, false,
                false, false,
                [], [], [], null);
        },
        [],
    );



    return <div>
        <Autocomplete
            id="autocomplete-label"
            options={labelRecords.map(r => r["_fields"] ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option}
            style={{ width: 350, marginLeft: "5px",marginTop: "0px" }}
            inputValue={labelInputText}
            onInputChange={(event, value) => {
                setLabelInputText(value);
                queryCallback("CALL db.schema.nodeTypeProperties() YIELD nodeLabels UNWIND nodeLabels as nodeLabel WITH nodeLabel WHERE toLower(nodeLabel) CONTAINS toLower($input) RETURN DISTINCT nodeLabel LIMIT 5", { input: value }, setLabelRecords);
            }}
            value={labelValue}
            onChange={(event, newValue) => {
                setLabelValue(newValue);

                if (newValue && propertyValue) {
                    const new_parameter_name = "neodash_" + (newValue + "_" + propertyValue + (id == "" || id.startsWith("_") ? id : "_"+id)).toLowerCase();
                    setParameterName(new_parameter_name);
                    const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + newValue + "`) \nWHERE toLower(toString(n.`" + propertyValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + propertyValue + "` as value LIMIT 5";
                    onQueryUpdate(newQuery);
                } else {
                    setParameterName(null);
                }
            }}
            renderInput={(params) => <TextField {...params} label={"Node Label"} />}
        />
        <Autocomplete
            id="autocomplete-property"
            options={propertyRecords.map(r => r["_fields"] ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option}
            style={{ display: "inline-block", width: 250, marginLeft: "5px", marginTop: "5px" }}
            inputValue={propertyInputText}
            onInputChange={(event, value) => {
                setPropertyInputText(value);
                queryCallback("CALL db.schema.nodeTypeProperties() YIELD nodeLabels, propertyName WITH * WHERE $label IN nodeLabels RETURN DISTINCT propertyName LIMIT 5", { label: labelValue }, setPropertyRecords);
            }}
            value={propertyValue}
            onChange={(event, newValue) => {
                setPropertyValue(newValue);

                if (newValue && labelValue) {
                    const new_parameter_name = "neodash_" + (labelValue + "_" + newValue + (id == "" || id.startsWith("_") ? id : "_"+id)).toLowerCase();
                    setParameterName(new_parameter_name);
                    const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + labelValue + "`) \nWHERE toLower(toString(n.`" + newValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + newValue + "` as value LIMIT 5";
                    onQueryUpdate(newQuery);
                } else {
                    setParameterName(null);
                }
            }}
            renderInput={(params) => <TextField {...params} label={"Property Name"} />}
        />
        
        <NeoFieldSelection placeholder='id'
            label="ID (optional)" numeric={true} value={id}
            style={{width: "90px", marginTop: "5px", marginLeft: "10px"}}
            onChange={(value) => {
                const newValue = value ? "_" + value : "";
                setId(value);
                if (propertyValue && labelValue) {
                    const new_parameter_name = "neodash_" + (labelValue + "_" + propertyValue + newValue).toLowerCase();
                    setParameterName(new_parameter_name);
                    const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + labelValue + "`) \nWHERE toLower(toString(n.`" + propertyValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + propertyValue + "` as value LIMIT 5";
                    onQueryUpdate(newQuery);
                }
            }} />
        <br/><br/>
        {parameterName ? <p style={{ color: "grey", fontSize: 12, paddingLeft: "5px", border: "1px solid lightgrey", marginTop: "0px" }} >Insert <b>${parameterName}</b> into a Cypher query to use the selected value.</p> : <p style={{ color: "grey", fontSize: 12, paddingLeft: "5px", border: "1px solid lightgrey", marginTop: "0px" }}>
            {REPORT_TYPES[type].helperText}
        </p>}
        
    </div>;
}

export default NeoCardSettingsContentPropertySelect;