import { EXAMPLE_REPORTS } from '../config/ExampleConfig';
import { REPORT_TYPES } from '../config/ReportConfig';
import { EXAMPLE_ADVANCED_REPORTS } from './advancedcharts/AdvancedChartsExampleConfig';
import { ADVANCED_REPORT_TYPES } from './advancedcharts/AdvancedChartsReportConfig';

// Tell the application what charts are available, dynmically, based on the selected extensions.
export const getReportTypes = (extensions) => {
  if (extensions && extensions['advanced-charts'] && extensions['advanced-charts'].active) {
    return { ...REPORT_TYPES, ...ADVANCED_REPORT_TYPES };
  }
  return REPORT_TYPES;
};

// Tell the application what examples are available, dynmically, based on the selected extensions.
export const getExampleReports = (extensions) => {
  if (extensions && extensions['advanced-charts'] && extensions['advanced-charts'].active) {
    return [...EXAMPLE_REPORTS, ...EXAMPLE_ADVANCED_REPORTS];
  }
  return EXAMPLE_REPORTS;
};
