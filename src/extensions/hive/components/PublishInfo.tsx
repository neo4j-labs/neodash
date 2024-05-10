import React from 'react';
import { Alert, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { config } from '../config/dynamicConfig';
import { getDbConnectionUrl } from '../util/util';
import { HiveSolutionDomain } from '../config/SolutionsConstants';

export const PublishInfo = (props) => {
  const { hasPublished, solutionId, connection, title, domain, setDomain } = props;

  const baseDemoUrl = config('NeoDashBaseDemoUrl');
  const hiveUiSolutionsUrl = config('GalleryUIUrl');

  const neoDashDemoUrl = `${baseDemoUrl}/?hivedashboarduuid=${solutionId}`;
  const hiveCardUrl = `${hiveUiSolutionsUrl}/${solutionId}`;

  const exportHiveJson = () => {
    const datajson = {
      neoDashDemoUrl,
      hiveCardUrl,
      hiveDatabaseNeoUrl: getDbConnectionUrl(connection),
      hiveDatabase: connection.database,
      hiveDatabaseUsername: connection.username,
      hiveDatabasePassword: connection.password,
      dashboardTitle: title,
    };
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(datajson))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${title}.json`;

    link.click();
  };

  const setDemoVisibility = (event) => {
    setDomain(event.target.value);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      {!hasPublished ? (
        <>
          <FormControl
            style={{
              margin: '10px',
              display: 'flex',
              flexFlow: 'row',
              alignItems: 'center',
            }}
          >
            <FormLabel id='demo-visibility-controlled-radio-buttons-group'>Visibility:</FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-visibility-controlled-radio-buttons-group'
              name='controlled-radio-buttons-group'
              value={domain}
              onChange={setDemoVisibility}
              style={{ marginLeft: '15px' }}
            >
              <FormControlLabel value={HiveSolutionDomain.Private} control={<Radio />} label='Private' />
              <FormControlLabel value={HiveSolutionDomain.Public} control={<Radio />} label='Public' />
            </RadioGroup>
          </FormControl>
          <div
            style={{
              display: 'flex',
              marginTop: '10px',
              height: '240px',
              alignItems: 'center',
              width: '650px',
              justifyContent: 'center',
            }}
          >
            <Alert className='alert' severity='info'>
              Click the Publish button to publish to Hive
            </Alert>
          </div>
        </>
      ) : (
        <>
          <Alert className='alert' severity='success'>
            Your demo has been published to Hive!
          </Alert>
          <ul style={{ lineHeight: '1.8em' }}>
            <li>
              Your published demo URL is:{' '}
              <a style={{ marginLeft: '5px' }} href={neoDashDemoUrl} target='_blank'>
                {neoDashDemoUrl}
              </a>
            </li>
            <li>
              You can configure your demo card in Hive here:{' '}
              <a style={{ marginLeft: '5px' }} href={hiveCardUrl} target='_blank'>
                {hiveCardUrl}
              </a>
            </li>
            <Alert className='alert' severity='info'>
              Please configure the following in Hive: Dashboard Image, Documentation, Use Case, Vertical, Additional
              Authors
            </Alert>
          </ul>
          <Button variant='outlined' onClick={exportHiveJson}>
            Download your published information as JSON
          </Button>
        </>
      )}
    </div>
  );
};
