import { Record as Neo4jRecord } from 'neo4j-driver'
export default interface ReportProps {
    records: Neo4jRecord[];
    first?: Neo4jRecord;
}

export interface ChartReportProps extends ReportProps {
    stacked?: boolean;
    layout?: 'horizontal' | 'vertical';
    config?: Record<string, any>
}

// NeoDash Extension
export interface ExtendedChartReportProps extends ChartReportProps {
    settings?: {};
}
