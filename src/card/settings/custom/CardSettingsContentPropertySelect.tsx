
import React, { useCallback, useContext } from 'react';
import { REPORT_TYPES, RUN_QUERY_DELAY_MS } from '../../../config/ReportConfig';
import { QueryStatus, runCypherQuery } from '../../../report/CypherQueryRunner';
import { Neo4jContext, Neo4jContextState } from "use-neo4j/dist/neo4j.context";
import { debounce, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import NeoFieldSelection from '../../../component/FieldSelection';

const NeoCardSettingsContentPropertySelect = ({ type, database, settings, query, onQueryUpdate }) => {
    const { driver } = useContext<Neo4jContextState>(Neo4jContext);
    if (!driver) throw new Error('`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?')

    const debouncedRunCypherQuery = useCallback(
        debounce(runCypherQuery, RUN_QUERY_DELAY_MS),
        [],
    );


    const manualPropertyNameSpecification = settings['manualPropertyNameSpecification'];
    const label = query.split("`")[1] ? query.split("`")[1] : undefined;
    const property = query.split("`")[3] ? query.split("`")[3] : undefined;

    const [labelInputText, setLabelInputText] = React.useState(label);
    const [labelValue, setLabelValue] = React.useState(label);
    const [labelRecords, setLabelRecords] = React.useState([]);
    const [propertyInputText, setPropertyInputText] = React.useState(property);
    const [propertyValue, setPropertyValue] = React.useState(property);
    const [parameterName, setParameterName] = React.useState("");
    const [propertyRecords, setPropertyRecords] = React.useState([]);

    // Reverse engineer the label, property, ID from the generated query.
    const approxParam = query.split("\n")[0].split("$")[1];
    const id = (approxParam && approxParam.split("_").length > 3) && !isNaN(parseInt(approxParam.split("_")[approxParam.split("_").length - 1])) ? approxParam.split("_")[approxParam.split("_").length - 1] : "";
    const [idValue, setIdValue] = React.useState(id);
    if (!parameterName && labelValue && propertyValue) {
        setParameterName("neodash_" + (labelValue + "_" + propertyValue + (idValue == "" || idValue.startsWith("_") ? idValue : "_" + idValue)).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_"));
    }
    // Define query callback to allow reports to get extra data on interactions.
    const queryCallback = useCallback(
        (query, parameters, setRecords) => {
            debouncedRunCypherQuery(driver, database, query, parameters, {}, [], 10,
                (status) => { status == QueryStatus.NO_DATA ? setRecords([]) : null },
                (result => setRecords(result)),
                () => { return }, false,
                false, false,
                [], [], [], [], null);
        },
        [],
    );

    function handleNodeLabelSelectionUpdate(newValue) {
        setLabelValue(newValue);
        setPropertyValue(undefined);
        setParameterName("");
        if (newValue && propertyValue) {
            const new_parameter_name = "neodash_" + (newValue + "_" + propertyValue + (idValue == "" || idValue.startsWith("_") ? idValue : "_" + idValue)).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
            const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + newValue + "`) \nWHERE toLower(toString(n.`" + propertyValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + propertyValue + "` as value LIMIT 5";
            onQueryUpdate(newQuery);
        } else {
            setParameterName("");
        }
    }

    function handlePropertyNameSelectionUpdate(newValue) {
        setPropertyValue(newValue);
        if (newValue && labelValue) {
            const new_parameter_name = "neodash_" + (labelValue + "_" + newValue + (idValue == "" || idValue.startsWith("_") ? idValue : "_" + idValue)).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
            setParameterName(new_parameter_name);
            const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + labelValue + "`) \nWHERE toLower(toString(n.`" + newValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + newValue + "` as value LIMIT 5";
            onQueryUpdate(newQuery);
        } else {
            setParameterName(null);
        }
    }

    return <div>
        <p style={{ color: "grey", fontSize: 12, paddingLeft: "5px", border: "1px solid lightgrey", marginTop: "0px" }}>
            {REPORT_TYPES[type].helperText}
        </p>
        <Autocomplete
            id="autocomplete-label"
            options={manualPropertyNameSpecification ? [labelValue] : labelRecords.map(r => r["_fields"] ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option ? option : ""}
            style={{ width: 350, marginLeft: "5px", marginTop: "0px" }}
            inputValue={labelInputText}
            onInputChange={(event, value) => {
                setLabelInputText(value);
                if (manualPropertyNameSpecification) {
                    handleNodeLabelSelectionUpdate(value);
                } else {
                    queryCallback("CALL db.schema.nodeTypeProperties() YIELD nodeLabels UNWIND nodeLabels as nodeLabel WITH nodeLabel WHERE toLower(nodeLabel) CONTAINS toLower($input) RETURN DISTINCT nodeLabel LIMIT 5", { input: value }, setLabelRecords);
                }
            }}
            value={labelValue}
            onChange={(event, newValue) => handleNodeLabelSelectionUpdate(newValue)}
            renderInput={(params) => <TextField {...params} placeholder="Start typing..." InputLabelProps={{ shrink: true }} label={"Node Label"} />}
        />
        {labelValue ? <><Autocomplete
            id="autocomplete-property"
            options={manualPropertyNameSpecification ? [propertyValue] : propertyRecords.map(r => r["_fields"] ? r["_fields"][0] : "(no data)")}
            getOptionLabel={(option) => option ? option : ""}
            style={{ display: "inline-block", width: 200, marginLeft: "5px", marginTop: "5px" }}
            inputValue={propertyInputText}
            onInputChange={(event, value) => {
                setPropertyInputText(value);
                if (manualPropertyNameSpecification) {
                    handlePropertyNameSelectionUpdate(value);
                } else {
                    queryCallback("CALL db.schema.nodeTypeProperties() YIELD nodeLabels, propertyName WITH * WHERE $label IN nodeLabels AND toLower(propertyName) CONTAINS toLower($input) RETURN DISTINCT propertyName LIMIT 5", { label: labelValue, input: value }, setPropertyRecords);
                }
            }}
            value={propertyValue}
            onChange={(event, newValue) => handlePropertyNameSelectionUpdate(newValue)}
            renderInput={(params) => <TextField {...params} placeholder="Start typing..." InputLabelProps={{ shrink: true }} label={"Property Name"} />}
        />
            <NeoFieldSelection placeholder='number'
                label="Number (optional)" numeric={true} value={idValue}
                style={{ width: "140px", marginTop: "5px", marginLeft: "10px" }}
                onChange={(value) => {
                    const newValue = value ? "_" + value : "";
                    setIdValue(value);
                    if (propertyValue && labelValue) {
                        const new_parameter_name = "neodash_" + (labelValue + "_" + propertyValue + newValue).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
                        setParameterName(new_parameter_name);
                        const newQuery = "// $" + new_parameter_name + "\nMATCH (n:`" + labelValue + "`) \nWHERE toLower(toString(n.`" + propertyValue + "`)) CONTAINS toLower($input) \nRETURN DISTINCT n.`" + propertyValue + "` as value LIMIT 5";
                        onQueryUpdate(newQuery);
                    }
                }} /></> : <></>}
        {parameterName ? <p>Use <b>${parameterName}</b> in a query to use the parameter.</p> : <></>}

    </div>;
}

export default NeoCardSettingsContentPropertySelect;