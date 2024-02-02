import { Alert } from '@mui/material';
import React, { useState } from 'react';
import { Dropzone } from './Dropzone';
import { InlineBox } from '../common/Common';
import './UploadDatabase.css';

export const UploadDatabase = (props) => {
  const { existingDbName, setConnection } = props;

  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [fileUploadResponse, setFileUploadResponse] = useState({});

  const onUploadComplete = (uploadInfo) => {
    setUploadCompleted(true);
    setFileUploadResponse(uploadInfo);

    const parsedUri = uploadInfo.neo4jDriverUri?.match(/(.+):\/\/([\w.-]+):?(\d+)?/) || [];

    setConnection({
      protocol: parsedUri[1],
      url: parsedUri[2],
      port: parsedUri[3],
      username: uploadInfo.newDbReaderUser,
      password: uploadInfo.newDbReaderPassword,
      database: uploadInfo.dbName,
    });
  };

  const getPreInfo = () => {
    if (existingDbName) {
      return (
        <div style={{ display: 'flex', flexFlow: 'column', marginTop: '5px' }}>
          <Alert severity='warning'>
            You previously uploaded database <InlineBox message={existingDbName} />. Click Overwrite to overwrite this
            database when uploading.
          </Alert>
        </div>
      );
    }
    return <></>;
  };

  const getDropzoneMessage = () => {
    return 'Drop a .dump file here, or click to select a file';
  };

  return (
    <>
      {uploadCompleted ? (
        <ul style={{ lineHeight: '1.8em' }}>
          <li>
            Your database has been uploaded as <InlineBox message={fileUploadResponse.dbName} />
          </li>
          <li>
            You can access the database here:
            <a style={{ marginLeft: '5px' }} href={fileUploadResponse.neo4jBrowserUri} target='_blank'>
              {fileUploadResponse.neo4jBrowserUri}
            </a>
          </li>
          <li>The database admin username and password are:</li>
          <div>
            <InlineBox message={fileUploadResponse.newDbAdminUser} />/
            <InlineBox message={fileUploadResponse.newDbAdminPassword} />
          </div>
          {!existingDbName && (
            <Alert className='credentialsWarning' severity='warning'>
              IMPORTANT! Please capture the admin credentials as they are not stored anywhere.
            </Alert>
          )}
          <li>Users of your dashboard will automatically use the read-only account:</li>
          <div>
            <InlineBox message={fileUploadResponse.newDbReaderUser} />/
            <InlineBox message={fileUploadResponse.newDbReaderPassword} />
          </div>
        </ul>
      ) : (
        <Dropzone
          preInfo={getPreInfo()}
          existingDbName={existingDbName}
          message={getDropzoneMessage()}
          onUploadComplete={onUploadComplete}
        />
      )}
    </>
  );
};
