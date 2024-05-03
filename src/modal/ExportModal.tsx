import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import NeoDashboardSidebarExportModal from '../dashboard/sidebar/modal/DashboardSidebarExportModal';
import { getDashboardJson } from './ModalSelectors';
import { DocumentArrowDownIconOutline, DocumentTextIconOutline } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';
/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */
export const NeoExportModal = ({ dashboard }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Tooltip title='Export' aria-label='export' disableInteractive>
        <IconButton className='n-mx-1' onClick={() => setOpen(true)} aria-label='Export'>
          <DocumentArrowDownIconOutline />
        </IconButton>
      </Tooltip>
      <NeoDashboardSidebarExportModal
        open={open}
        dashboard={dashboard}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoExportModal);
