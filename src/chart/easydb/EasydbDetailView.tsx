import React from 'react';
import { ChartProps } from '../Chart';

const EasydbDetailView = (props: ChartProps) => {
   const records = props.records;
   return records.map(r => {
       return <div class="w-[800px] overflow-y-auto"><easydb-detail-view uuid={r._fields[0]}/></div>
   })
}

export default EasydbDetailView;