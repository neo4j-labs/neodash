import { EXAMPLE_REPORTS } from '../config/ExampleConfig';
import { REPORT_TYPES } from '../config/ReportConfig';

import { ADVANCED_REPORT_TYPES } from './advancedcharts/AdvancedChartsReportConfig';
import { EXAMPLE_ADVANCED_REPORTS } from './advancedcharts/AdvancedChartsExampleConfig';
import { FORMS } from './forms/FormsReportConfig';
import { EXAMPLE_FORMS } from './forms/FormsExampleConfig';
// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions[name]?.active;
};

// Tell the application what charts are available, dynmically, based on the selected extensions.
export const getReportTypes = (extensions) => {
  let charts = { ...REPORT_TYPES };
  if (extensions['advanced-charts']?.active) {
    charts = { ...charts, ...ADVANCED_REPORT_TYPES };
  }
  if (extensions?.forms?.active) {
    charts = { ...charts, ...FORMS };
  }
  return charts;
};

// Tell the application what examples are available, dynmically, based on the selected extensions.
export const getExampleReports = (extensions) => {
  let examples = [...EXAMPLE_REPORTS];
  if (extensions['advanced-charts']?.active) {
    examples = [...examples, ...EXAMPLE_ADVANCED_REPORTS];
  }
  if (extensions?.forms?.active) {
    examples = [...examples, ...EXAMPLE_FORMS];
  }
  return examples;
};
