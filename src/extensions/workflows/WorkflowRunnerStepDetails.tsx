import { Button, TextareaAutosize } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { NeoTableChart } from '../../chart/table/TableChart';
import { REPORT_TYPES } from '../../config/ReportConfig';

const textFieldStyle = { width: '155px', marginBottom: '10px', marginRight: '10px', marginLeft: '10px' };

enum views {
  QUERY,
  DATA,
}

const NeoWorkflowRunnerStepDetails = ({ step, result }) => {
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
          Data
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
            style={{ width: '100%', height: '80px !important', border: '1px solid lightgray' }}
            maxRows={1}
            minRows={1}
            className={'textinput-linenumbers'}
            value={step.query}
            aria-label=''
            placeholder='Your dashboard JSON should show here'
          />
        ) : (
          <></>
        )}

        {view == views.DATA ? (
          <Chart records={result} dimensions={{ width: 500, height: 500 }} settings={{}} fields={[]}></Chart>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NeoWorkflowRunnerStepDetails;
