import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { ChartReportProps, ExtendedChartReportProps } from '../ChartProps';
import { checkResultKeys, recordToNative } from '../ChartUtils';
import { green, grey } from '@material-ui/core/colors'
import { evaluateRulesOnDict } from '../../report/ReportRuleEvaluator';

/**
 * This visualization was extracted from https://github.com/neo4j-labs/charts.
 */
export default function BarVisualization(props: ExtendedChartReportProps) {
   
}