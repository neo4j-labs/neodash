import { Dialog, DialogContent } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

const DrillDownModal = ({ _nodeParameters, _pageNumber, _newPageNumber }) => {
  return (
    <Dialog
      maxWidth={'md'}
      fullWidth
      scroll={'paper'}
      open={true}
      onClose={() => {
        console.log('aewndaooda');
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogContent></DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DrillDownModal);
