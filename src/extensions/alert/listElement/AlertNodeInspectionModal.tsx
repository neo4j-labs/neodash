import ExtensionIcon from '@material-ui/icons/Extension';

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { DialogContent } from '@material-ui/core';
import NeoGraphChart from '../../../chart/graph/GraphChart';
import { connect } from 'react-redux';
import { getExtensionDatabase } from '../../ExtensionsSelectors';
import { NeoReportWrapper } from '../../../report/ReportWrapper';
import GraphEntityInspectionTable from '../../../chart/graph/component/GraphEntityInspectionTable';

const AlertNodeInspectionModal = ({ entity, modalOpen, setModalOpen, database }) => {
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
            Labels: {entity.labels.join(', ')}
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge overlap='rectangular' badgeContent={''}>
                <CloseIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
              <h4>Node Properties</h4>
              <br />
              <GraphEntityInspectionTable entity={entity}></GraphEntityInspectionTable>
              <br />
            </div>
            <h4>Node Neighborhood</h4>
            <div style={{ width: '100%', height: 600 }}>
              <NeoReportWrapper
                database={database}
                query={`MATCH (n) WHERE id(n) = ${entity.id} OPTIONAL MATCH p=(n)--() RETURN n,p`}
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
  database: getExtensionDatabase(state, 'alerts'),
});

const mapDispatchToProps = (_dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(AlertNodeInspectionModal);
