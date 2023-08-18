import { EXAMPLE_REPORTS } from '../config/ExampleConfig';
import { REPORT_TYPES } from '../config/ReportConfig';
import { EXAMPLE_ADVANCED_REPORTS } from './advancedcharts/AdvancedChartsExampleConfig';
import { ADVANCED_REPORT_TYPES } from './advancedcharts/AdvancedChartsReportConfig';
import { SELECTORS_TYPES } from './selectors/SelectorsReportConfig';
import { update } from './selectors/Utils';

// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions && extensions[name] && extensions[name].active;
};

// Tell the application what charts are available, dynmically, based on the selected extensions.
export const getReportTypes = (extensions) => {
  let result = REPORT_TYPES;
  if (extensions?.['advanced-charts']?.active) {
    result = update(result, ADVANCED_REPORT_TYPES);
  }

  if (extensions?.selectors?.active) {
    return update(result, SELECTORS_TYPES);
  }

  return result;
};

// Tell the application what examples are available, dynmically, based on the selected extensions.
export const getExampleReports = (extensions) => {
  if (extensions && extensions['advanced-charts'] && extensions['advanced-charts'].active) {
    return [...EXAMPLE_REPORTS, ...EXAMPLE_ADVANCED_REPORTS];
  }
  return EXAMPLE_REPORTS;
};
