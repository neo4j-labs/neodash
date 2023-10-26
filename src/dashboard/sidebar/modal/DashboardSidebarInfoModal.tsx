import React from 'react';
import { Dialog } from '@neo4j-ndl/react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarInfoModal = ({ open, dashboard, handleClose }) => {
  const columns = [
    { field: 'field', headerName: 'Field', width: 150 },
    { field: 'value', headerName: 'Value', width: 600 },
  ];

  const rows = dashboard
    ? [
        { id: 0, field: 'ID', value: dashboard.uuid },
        { id: 1, field: 'Title', value: dashboard.title },
        { id: 2, field: 'Last Modified', value: dashboard.date },
        { id: 3, field: 'Author', value: dashboard.author },
        { id: 4, field: 'Version', value: dashboard.version },
      ]
    : [];

  return (
    <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>About '{dashboard && dashboard.title}'</Dialog.Header>
      <Dialog.Content>
        <div style={{ height: '300px' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            headerHeight={0}
            hideFooter={true}
            components={{
              ColumnSortedDescendingIcon: () => <></>,
              ColumnSortedAscendingIcon: () => <></>,
            }}
          />
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default NeoDashboardSidebarInfoModal;
