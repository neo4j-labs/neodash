import React, { useEffect } from 'react';
import { ChartProps } from '../Chart';

const EasydbDetailView = (props: ChartProps) => {
    useEffect(() => {
        let ele = document.getElementById("easydb");
        if (ele !== null) {
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute(
                "href",
                "easydb.css"
            );
            ele.shadowRoot.appendChild(link);
            }
    }, []);

   const { records, settings } = props;
   return records.map(r => {
       return <div class="w-[800px] overflow-y-auto"><easydb-detail-view id="easydb" systemid={r._fields[0]} appLanguage={settings.language} easydbInstance={settings.instance} token={settings.token} /></div>
   })
}

export default EasydbDetailView;