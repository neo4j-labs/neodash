import { Box } from '@mui/material';
import React from 'react';
import NeoCard from '../../card/Card';
import useUltraWide from '../../utils/useUltraWide';

export default function GroupReport({
  groupedReports,
  groupId,
  getBorderSpecsForGroupId,
  getReportKey,
  pagenumber,
  dashboardSettings,
  onRemovePressed,
  onPutItem,
  getAddCardButtonPosition,
  onClonePressed,
}) {
  const isUltraWide = useUltraWide();
  return groupedReports[groupId].length > 0 ? (
    <Box display='grid' gridTemplateColumns='repeat(24, 1fr)' columnGap={1} sx={getBorderSpecsForGroupId(groupId)}>
      {groupedReports[groupId]
        .sort((a: any, b: any) => {
          const aGroupOrder = a.groupOrder;
          const bGroupOrder = b.groupOrder;
          const aUwGroupOrder = a.uwGroupOrder ?? 0;
          const bUwGroupOrder = b.uwGroupOrder ?? 0;

          if (isUltraWide) {
            return aUwGroupOrder - bUwGroupOrder;
          }
          return aGroupOrder - bGroupOrder;
        })
        .map((report: { id: any; width: any; height: any; x: any; y: any; uwHeight: number }) => {
          const { id, width: w, height: h, uwHeight } = report;
          let modifiedWidth = w;
          let modifiedHeight = h;
          if (isUltraWide) {
            modifiedWidth = w / 2;
            modifiedHeight = uwHeight ?? 2;
          }

          return (
            <Box
              id={id}
              gridColumn={`span ${modifiedWidth}`}
              gridRow={`span ${modifiedHeight}`}
              sx={{ height: modifiedHeight * 100, paddingBottom: '15px' }}
            >
              <NeoCard
                id={id}
                key={getReportKey(pagenumber, id)}
                dashboardSettings={dashboardSettings}
                onRemovePressed={onRemovePressed}
                onPutItem={onPutItem}
                onClonePressed={(id) => {
                  const { x, y } = getAddCardButtonPosition();
                  onClonePressed(id, x, y);
                }}
              />
            </Box>
          );
        })}
    </Box>
  ) : null;
}
