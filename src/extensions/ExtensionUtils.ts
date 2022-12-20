import { EXAMPLE_REPORTS } from '../config/ExampleConfig';
import { REPORT_TYPES } from '../config/ReportConfig';
import { EXAMPLE_ADVANCED_REPORTS } from './advancedcharts/AdvancedChartsExampleConfig';
import { ADVANCED_REPORT_TYPES } from './advancedcharts/AdvancedChartsReportConfig';

// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions && extensions[name];
};

// Tell the application what charts are available, dynmically, based on the selected extensions.
export const getReportTypes = (extensions) => {
  if (extensions && extensions['advanced-charts']) {
    return { ...REPORT_TYPES, ...ADVANCED_REPORT_TYPES };
  }
  return REPORT_TYPES;
};

// Tell the application what examples are available, dynmically, based on the selected extensions.
export const getExampleReports = (extensions) => {
  if (extensions && extensions['advanced-charts']) {
    return [...EXAMPLE_REPORTS, ...EXAMPLE_ADVANCED_REPORTS];
  }
  return EXAMPLE_REPORTS;
};
