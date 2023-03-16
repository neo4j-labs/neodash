import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Dropzone } from './Dropzone';

export const UploadDatabase = (props) => {
  const { setConnection } = props;

  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [fileUploadResponse, setFileUploadResponse] = useState({});

  const onUploadComplete = (uploadInfo) => {
    setUploadCompleted(true);
    setFileUploadResponse(uploadInfo);

    const parsedUri = uploadInfo.neo4jDriverUri?.match(/(.+:)\/\/([\w\.]+):?(\d+)?/) || [];

    setConnection({
      protocol: parsedUri[0],
      url: parsedUri[1],
      port: parsedUri[2],
      username: uploadInfo.newDbReaderUser,
      password: uploadInfo.newDbAdminPassword,
      database: uploadInfo.dbName,
    });
  };

  return (
    <>
      {uploadCompleted ? (
        <>
          <Typography>Your database has been uploaded as {fileUploadResponse.dbName}</Typography>
          <Typography>
            You can access the database here:
            <a href={fileUploadResponse.neo4jBrowserUri} target='_blank'>
              {fileUploadResponse.neo4jBrowserUri}
            </a>
          </Typography>
          <Typography>
            The database admin username and password are:
            {fileUploadResponse.newDbAdminUser} /{fileUploadResponse.newDbAdminPassword}
          </Typography>
          <Typography>IMPORTANT! Please write these credentials down as they are not stored anywhere.</Typography>
          <Typography>
            Users of your dashboard will automatically use the read-only account:
            {fileUploadResponse.newDbReaderUser} /{fileUploadResponse.newDbReaderPassword}
          </Typography>
        </>
      ) : (
        <Dropzone message='Drop a .dump file here, or click to select a file' onUploadComplete={onUploadComplete} />
      )}
    </>
  );
};
