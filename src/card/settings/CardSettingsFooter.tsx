import React, { useEffect } from 'react';
import { REPORT_TYPES } from '../../config/ReportConfig'
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { FormControlLabel, FormGroup, Tooltip } from '@material-ui/core';
import NeoSetting from '../../component/field/Setting';
import { NeoCustomReportStyleModal, RULE_BASED_REPORT_CUSTOMIZATIONS } from '../../modal/CustomReportStyleModal';
import { HeroIcon, IconButton, Switch } from '@neo4j-ndl/react';

const update = (state, mutations) =>
    Object.assign({}, state, mutations)


const NeoCardSettingsFooter = ({ type, fields, reportSettings, reportSettingsOpen, onToggleReportSettings,
    onCreateNotification, onReportSettingUpdate }) => {

    const [reportSettingsText, setReportSettingsText] = React.useState(reportSettings);

    // Variables related to customizing report settings
    const [customReportStyleModalOpen, setCustomReportStyleModalOpen] = React.useState(false);
    const settingToCustomize = "styleRules";

    const debouncedReportSettingUpdate = useCallback(
        debounce(onReportSettingUpdate, 250),
        [],
    );

    const updateSpecificReportSetting = (field: string, value: any) => {
        const entry = {}
        entry[field] = value;
        setReportSettingsText(update(reportSettingsText, entry));
        debouncedReportSettingUpdate(field, value);
    };

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        setReportSettingsText(reportSettings);
    }, [JSON.stringify(reportSettings)])

    const settings = REPORT_TYPES[type]["settings"];

    // If there are no advanced settings, render nothing.
    if (Object.keys(settings).length == 0) {
        return <div></div>
    }

    // Else, build the advanced settings view.
    const advancedReportSettings = <div style={{ marginLeft: "5px" }}>
        {Object.keys(settings).map(setting =>
            <NeoSetting key={setting} name={setting}
                value={reportSettingsText[setting]}
                type={settings[setting]["type"]}
                label={settings[setting]["label"]}
                defaultValue={settings[setting]["default"]}
                choices={settings[setting]["values"]}
                onChange={(e) => updateSpecificReportSetting(setting, e)}
            />
        )}
    </div>

    return <div>
        <NeoCustomReportStyleModal
            settingName={settingToCustomize}
            settingValue={reportSettings[settingToCustomize]}
            type={type}
            fields={fields}
            customReportStyleModalOpen={customReportStyleModalOpen}
            setCustomReportStyleModalOpen={setCustomReportStyleModalOpen}
            onReportSettingUpdate={onReportSettingUpdate}
        ></NeoCustomReportStyleModal>
        <table style={{ borderTop: "1px dashed lightgrey", background: reportSettingsOpen ? "#f6f6f6" : "inherit", width: "100%" }}>
            <tbody>
                <tr>
                    <td>
                        <FormGroup >
                            <Switch label="Advanced settings"
                                checked={reportSettingsOpen}
                                onChange={onToggleReportSettings}
                                style={{ marginLeft: "5px" }} />
                        </FormGroup>
                    </td>
                    {RULE_BASED_REPORT_CUSTOMIZATIONS[type] ? <td>
                        <Tooltip title="Set rule-based styling" aria-label="">
                            <IconButton style={{ float: "right", marginRight: "10px" }} aria-label="custom styling"
                                onClick={(e) => {
                                    setCustomReportStyleModalOpen(true); // Open the modal.
                                }}
                                clean>
                                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="AdjustmentsIcon" />
                            </IconButton>
                        </Tooltip>
                    </td> : <></>}
                </tr>
                <tr>
                    <td colSpan={2} style={{ maxWidth: "100%" }}>
                        {reportSettingsOpen ? advancedReportSettings : <div></div>}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default NeoCardSettingsFooter;