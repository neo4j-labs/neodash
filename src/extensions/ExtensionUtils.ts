import { EXAMPLE_REPORTS } from "../config/ExampleConfig";
import { REPORT_TYPES } from "../config/ReportConfig";
import { EXAMPLE_ADVANCED_REPORTS } from "./advancedcharts/AdvancedChartsExampleConfig";
import { ADVANCED_REPORT_TYPES } from "./advancedcharts/AdvancedChartsReportConfig";

export const extensionEnabled = (extensions, name) => {
    return extensions && extensions[name];
}


export const getExampleReports = (extensions) => {
    if (extensions['advanced-charts']) {
        return [...EXAMPLE_REPORTS, ...EXAMPLE_ADVANCED_REPORTS];
    }
    return EXAMPLE_REPORTS;
}

export const getReportTypes = (extensions) => {
    if (extensions['advanced-charts']) {
        return { ...REPORT_TYPES, ...ADVANCED_REPORT_TYPES };
    }
    return REPORT_TYPES;
}