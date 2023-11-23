import { Box } from '@mui/material';
import React from 'react';
import NeoCard from '../../card/Card';

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
  return groupedReports[groupId].length > 0 ? (
    <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' columnGap={1} sx={getBorderSpecsForGroupId(groupId)}>
      {groupedReports[groupId]
        .sort((a: any, b: any) => a.groupOrder - b.groupOrder)
        .map((report: { id: any; width: any; height: any }) => {
          const { id, width: w, height: h } = report;
          return (
            <Box id={id} gridColumn={`span ${w}`} gridRow={`span ${h}`} sx={{ height: h * 210, paddingBottom: '15px' }}>
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
