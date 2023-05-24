import React from 'react';
import { REPORT_TYPES } from '../../../config/ReportConfig';
import NeoCodeViewerComponent from '../../../component/editor/CodeViewerComponent';
import { STEP_STATUS } from './WorkflowRunnerModal';
import { Button, TextareaAutosize } from '@mui/material';

enum views {
  QUERY,
  DATA,
}

const NeoWorkflowRunnerStepDetails = ({ step, records, status }) => {
  const [view, setView] = React.useState(views.QUERY);
  const Chart = REPORT_TYPES.table.component;
  return (
    <div style={{ width: '100%' }}>
      <div>
        <Button
          onClick={() => {
            setView(views.DATA);
          }}
          style={{ float: 'right', backgroundColor: 'white', marginBottom: 10 }}
          variant='contained'
          size='small'
        >
          {status == STEP_STATUS.ERROR ? 'Error' : 'Data'}
        </Button>
        <Button
          onClick={() => {
            setView(views.QUERY);
          }}
          style={{ float: 'right', backgroundColor: 'white', marginBottom: 10 }}
          variant='contained'
          size='small'
        >
          Query
        </Button>
      </div>
      <div style={{ width: '100%', height: '500' }}>
        {view == views.QUERY ? (
          <TextareaAutosize
            style={{ width: '100%', height: '360px !important', border: '1px solid lightgray' }}
            maxRows={22}
            minRows={22}
            className={'textinput-linenumbers'}
            value={step.query}
            aria-label=''
            placeholder='Your dashboard JSON should show here'
          />
        ) : (
          <></>
        )}

        {view == views.DATA ? (
          <div style={{ height: '380px', width: '100%', marginTop: '0px', marginBottom: '-12px', overflow: 'auto' }}>
            {status == STEP_STATUS.ERROR ? (
              <NeoCodeViewerComponent
                value={records && records[0] && records[0].error && records[0].error}
                placeholder={'Unknown query error, check the browser console.'}
              />
            ) : (
              <Chart records={records} dimensions={{ width: 400, height: 400 }} settings={{}} fields={[]}></Chart>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NeoWorkflowRunnerStepDetails;
