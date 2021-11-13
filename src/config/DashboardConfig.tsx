import { SELECTION_TYPES } from "./ReportConfig";

export const DASHBOARD_SETTINGS = {
    "pagenumber": {
        label: "Page Number",
        type: SELECTION_TYPES.NUMBER,
        disabled: true,
        helperText: "This is the number of the currently selected page."
    },
    "parameters": {
        label: "Global Parameters",
        type: SELECTION_TYPES.DICTIONARY,
        disabled: true,
        helperText: "These are the query parameters shared across all reports. You can set these using a 'property select' report."
    },
    "editable": {
        label: "Editable",
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
        helperText: "This controls whether users can edit your dashboard. Disable this to turn the dashboard into presentation mode."
    }
   
}