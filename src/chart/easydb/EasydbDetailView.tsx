import React from 'react';
import { ChartProps } from '../Chart';

const EasydbDetailView = (props: ChartProps) => {
   const records = props.records;
   return records.map(r => {
       return <div class="w-[800px] overflow-y-auto"><easydb-detail-view uuid="e95dcb74-77f6-4794-b468-506da8b7a3a1"/></div>
   })
}

export default EasydbDetailView;