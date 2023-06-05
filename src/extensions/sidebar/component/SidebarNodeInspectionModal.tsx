import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import NeoGraphChart from '../../../chart/graph/GraphChart';
import { connect } from 'react-redux';
import { getSidebarDatabase, NODE_SIDEBAR_PARAM_PREFIX } from '../state/SidebarSelectors';
import { NeoReportWrapper } from '../../../report/ReportWrapper';
import GraphEntityInspectionTable from '../../../chart/graph/component/GraphEntityInspectionTable';
import { getSelectionBasedOnFields } from '../../../chart/ChartUtils';
import { getExtensionSettings } from '../../state/ExtensionSelectors';
import { getPageNumber } from '../../../settings/SettingsSelectors';
import { getPageNumbersAndNames } from '../../../dashboard/DashboardSelectors';
import { setPageNumberThunk, updateGlobalParameterThunk } from '../../../settings/SettingsThunks';
import { Badge, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

// TODO: Same as 'Node card`, lets generalize this as a "detailed Node inspect modal".
const SidebarNodeInspectionModal = ({
  entity,
  modalOpen,
  setModalOpen,
  database,
  extensionSettings,
  pageNumber,
  pagesList,
  setPageNumber,
  onGlobalParameterUpdate,
}) => {
  const [selection, setSelection] = React.useState({});
  const [selectedParameters, setSelectedParameters] = React.useState([]);

  // Get page to drill down to, if enabled
  const drillDownPage = extensionSettings.moveToPage
    ? extensionSettings.moveToPage === 'Current Page'
      ? pageNumber
      : parseInt(extensionSettings.moveToPage.split('/')[0])
    : pageNumber;

  const handleClose = () => {
    setModalOpen(false);
  };

  /**
   * Function that has the responsibility to manage the drill down logic when you click the button
   */
  const handleDrilldown = () => {
    selectedParameters.forEach((nodeParam) => {
      onGlobalParameterUpdate(`${NODE_SIDEBAR_PARAM_PREFIX}${nodeParam}`, entity.properties[nodeParam]);
    });
    handleClose();
    setPageNumber(drillDownPage);
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
              <GraphEntityInspectionTable
                entity={entity}
                checklistEnabled={extensionSettings.drilldownEnabled}
                setSelectedParameters={setSelectedParameters}
              ></GraphEntityInspectionTable>
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
          {extensionSettings.drilldownEnabled ? (
            <Button
              onClick={() => {
                handleDrilldown();
              }}
              style={{ float: 'right', backgroundColor: 'white', marginBottom: 10 }}
              variant='contained'
              size='medium'
              endIcon={<PlayArrow />}
            >
              {`Go To Page ${pagesList[drillDownPage]}`}
            </Button>
          ) : (
            <></>
          )}
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  database: getSidebarDatabase(state),
  extensionSettings: getExtensionSettings(state, 'node-sidebar'),
  pagesList: getPageNumbersAndNames(state),
  pageNumber: getPageNumber(state),
});

const mapDispatchToProps = (dispatch) => ({
  setPageNumber: (newIndex: number) => {
    dispatch(setPageNumberThunk(newIndex));
  },
  onGlobalParameterUpdate: (key: any, value: any) => {
    dispatch(updateGlobalParameterThunk(key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarNodeInspectionModal);
