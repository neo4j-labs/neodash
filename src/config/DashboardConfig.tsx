import { SELECTION_TYPES } from "./ReportConfig";

export const DASHBOARD_SETTINGS = {
    "pagenumber": {
        label: "Page Number",
        type: SELECTION_TYPES.NUMBER,
        disabled: true
    },
    "editable": {
        label: "Editable",
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true
    },
    "parameters": {
        label: "Global Parameters",
        type: SELECTION_TYPES.DICTIONARY,
        disabled: true
    },
}