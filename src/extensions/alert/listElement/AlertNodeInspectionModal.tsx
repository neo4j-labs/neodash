import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { DialogContent } from '@material-ui/core';
import NeoGraphChart from '../../../chart/graph/GraphChart';
import { connect } from 'react-redux';
import { getSidebarDatabase } from './stateManagement/AlertSelectors';
import { NeoReportWrapper } from '../../../report/ReportWrapper';
import GraphEntityInspectionTable from '../../../chart/graph/component/GraphEntityInspectionTable';
import { getSelectionBasedOnFields } from '../../../chart/ChartUtils';

// TODO: Same as 'Node card`, lets generalize this as a "detailed Node inspect modal".
const AlertNodeInspectionModal = ({ entity, modalOpen, setModalOpen, database }) => {
  const [selection, setSelection] = React.useState({});

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {modalOpen ? (
        <Dialog
          maxWidth={'md'}
          fullWidth
          scroll={'paper'}
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            {entity.labels.join(', ')}
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <CloseIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
              <br />
              <GraphEntityInspectionTable entity={entity}></GraphEntityInspectionTable>
              <br />
            </div>

            <div style={{ width: '100%', height: 600 }}>
              {/* TODO: add missing parameters or make them optional in NeoReportWrapper */}
              <NeoReportWrapper
                database={database}
                selection={selection}
                setFields={(fields) => {
                  setSelection(getSelectionBasedOnFields(fields));
                }}
                // TODO - fix arbitrary safety limit from '100' to something else here.
                query={`MATCH (n) WHERE id(n) = ${entity.id} OPTIONAL MATCH p=(n)--() RETURN n,p LIMIT 100`}
                ChartType={NeoGraphChart}
                type={'graph'}
              ></NeoReportWrapper>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  database: getSidebarDatabase(state),
});

const mapDispatchToProps = (_dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(AlertNodeInspectionModal);
