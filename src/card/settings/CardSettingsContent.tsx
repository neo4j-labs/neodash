import React, { useEffect } from 'react';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import { REPORT_TYPES } from '../../config/ReportConfig'
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoField from '../../component/field/Field';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import { CARD_SIZES } from '../../config/CardConfig';


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
        <NeoField select label={"Type"} value={type}
            style={{ marginLeft: "0px", marginRight: "10px", width: "47%", maxWidth: "200px" }}
            onChange={(value) => onTypeUpdate(value)}
            choices={Object.keys(REPORT_TYPES).map((option) => (
                <MenuItem key={option} value={option}>
                    {REPORT_TYPES[option].label}
                </MenuItem>
            ))} />

        {REPORT_TYPES[type]["disableRefreshRate"] == undefined ? <NeoField placeholder='0 (No Refresh)'
            label="Refresh Rate (sec)" numeric={true} value={refreshRateText}
            style={{ width: "47%", maxWidth: "200px" }}
            onChange={(value) => {
                setRefreshRateText(value);
                debouncedRefreshRateUpdate(value);
            }} /> : <></>}

        <br /><br />
        {/* Allow for overriding the code box with a custom component */}
        {REPORT_TYPES[type]["settingsComponent"] ?
            <SettingsComponent type={type} onReportSettingUpdate={onReportSettingUpdate} settings={reportSettings} database={database} query={query} onQueryUpdate={onQueryUpdate} /> :
            <div>
                <NeoCodeEditorComponent
                    key={0}
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