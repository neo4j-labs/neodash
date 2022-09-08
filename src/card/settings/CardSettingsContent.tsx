import React, { useEffect } from 'react';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import { REPORT_TYPES } from '../../config/ReportConfig'
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoField from '../../component/field/Field';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import { CARD_SIZES } from '../../config/CardConfig';
import { Dropdown, TextInput } from '@neo4j-ndl/react';


const NeoCardSettingsContent = ({ query, database, reportSettings, refreshRate, type,
    onQueryUpdate, onRefreshRateUpdate, onReportSettingUpdate, onTypeUpdate }) => {

    // Ensure that we only trigger a text update event after the user has stopped typing.
    const [queryText, setQueryText] = React.useState(query);
    const debouncedQueryUpdate = useCallback(
        debounce(onQueryUpdate, 250),
        [],
    );
    const [refreshRateText, setRefreshRateText] = React.useState(refreshRate);
    const debouncedRefreshRateUpdate = useCallback(
        debounce(onRefreshRateUpdate, 250),
        [],
    );

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (query !== queryText) {
            setQueryText(query);
        }
    }, [query])

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (refreshRate !== refreshRateText) {
            setRefreshRateText((refreshRate !== undefined) ? refreshRate : "");
        }
    }, [refreshRate])


    const SettingsComponent = REPORT_TYPES[type].settingsComponent;

    return <CardContent style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <Dropdown id="type"
            onChange={(newValue) => newValue && onTypeUpdate(Object.keys(REPORT_TYPES).find(key => REPORT_TYPES[key].label === newValue.value))}
            options={Object.keys(REPORT_TYPES).map((option) => (
                { label: REPORT_TYPES[option].label, value: REPORT_TYPES[option].label }
            ))}
            value={{label: REPORT_TYPES[type].label, value: REPORT_TYPES[type].label}}
            label="Type"
            type="select"
            selectProps={{menuPortalTarget: document.querySelector('body')}}
            fluid
            style={{ marginLeft: "0px", marginRight: "10px", width: "47%", maxWidth: "200px", display: "inline-block" }}/>

        {REPORT_TYPES[type]["disableRefreshRate"] == undefined ?
        <div style={{ width: "47%", maxWidth: "200px", display: "inline-block" }}>
            <TextInput id="refreshRate"
                value={refreshRateText}
                onChange={(e) => {
                    setRefreshRateText(e.target.value);
                    debouncedRefreshRateUpdate(e.target.value);
                }}
                label="Refresh Rate (sec)"
                placeholder="0 (No Refresh)"
                fluid
                />
        </div>
        
        : <></>}

        <br /><br />
        {/* Allow for overriding the code box with a custom component */}
        {REPORT_TYPES[type]["settingsComponent"] ?
            <SettingsComponent type={type} onReportSettingUpdate={onReportSettingUpdate} settings={reportSettings} database={database} query={query} onQueryUpdate={onQueryUpdate} /> :
            <div>
                <NeoCodeEditorComponent
                    value={queryText}
                    editable={true}
                    language={REPORT_TYPES[type]["inputMode"] ? REPORT_TYPES[type]["inputMode"] : "cypher"}
                    onChange={(value) => {
                        debouncedQueryUpdate(value);
                        setQueryText(value);
                    }}
                    placeholder={"Enter Cypher here..."}
                />
                <p style={{ color: "grey", fontSize: 12, paddingLeft: "5px", borderBottom: "1px solid lightgrey", borderLeft: "1px solid lightgrey", borderRight: "1px solid lightgrey", marginTop: "0px" }}>{REPORT_TYPES[type].helperText}</p>
            </div>}

    </CardContent>
};

export default NeoCardSettingsContent;