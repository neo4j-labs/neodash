import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from '@neo4j-ndl/react';
import NeoDashboardSidebarExportModal from '../dashboard/sidebar/modal/DashboardSidebarExportModal';
import { getDashboardJson } from './ModalSelectors';
import { DocumentTextIconOutline } from '@neo4j-ndl/react/icons';
/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */
export const NeoExportModal = ({ dashboard }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <MenuItem onClick={() => setOpen(true)} icon={<DocumentTextIconOutline />} title='Export' />
      <NeoDashboardSidebarExportModal
        open={open}
        dashboard={dashboard}
        handleClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoExportModal);
