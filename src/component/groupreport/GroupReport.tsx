import { Box, Grid } from '@mui/material';
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
    <Box sx={getBorderSpecsForGroupId(groupId)}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12 }}>
        {groupedReports[groupId]
          .sort((a: any, b: any) => a.groupOrder - b.groupOrder)
          .map((report: { id: any; width: any; height: any }) => {
            const { id, width: w, height: h } = report;
            return (
              <Grid
                item
                key={id}
                xs={Math.min(w * 4, 12)}
                sm={Math.min(w * 2, 12)}
                md={Math.min(w * 2, 12)}
                lg={Math.min(w, 12)}
                xl={Math.min(w, 12)}
                height={h * 210}
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
              </Grid>
            );
          })}
      </Grid>
    </Box>
  ) : null;
}
