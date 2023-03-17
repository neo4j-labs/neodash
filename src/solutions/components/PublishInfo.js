import React from 'react';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { config } from '../config/dynamicConfig';
import { getDbConnectionUrl } from '../util/util';
import './PublishInfo.css';

export const PublishInfo = (props) => {
  const { hasPublished, solutionId, connection, title } = props;

  const baseDemoUrl = config('NEODASH_BASE_DEMO_URL');
  const hiveUiSolutionsUrl = config('HIVE_UI');

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

  return (
    <div style={{ marginTop: '10px' }}>
      {!hasPublished ? (
        <div className='publishInfo'>Click the Publish button to publish to Hive</div>
      ) : (
        <>
          <Alert className='alert' severity='success'>
            Your demo has been published to Hive!
          </Alert>
          <ul style={{ lineHeight: '1.8em' }}>
            <li>
              Your published demo URL is:
              <a style={{ marginLeft: '5px' }} href={neoDashDemoUrl} target='_blank'>
                {neoDashDemoUrl}
              </a>
            </li>
            <li>
              You can configure your demo card in Hive here:
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
