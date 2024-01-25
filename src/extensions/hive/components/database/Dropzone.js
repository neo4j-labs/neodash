import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { config } from '../../config/dynamicConfig';
import { uploadFile } from '../../persistence/FileUpload';
import LinearProgress from '@material-ui/core/LinearProgress';
import SyncIcon from '@material-ui/icons/Sync';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
import './Dropzone.css';

const DEFAULT_MAX_UPLOAD_SIZE = 1024 * 1024 * 1024; // 1GB
const getMaxSize = () => {
  let maxSize = parseInt(config('MAX_UPLOAD_SIZE'));
  return isNaN(maxSize) ? DEFAULT_MAX_UPLOAD_SIZE : maxSize;
};

export function Dropzone(props) {
  const { preInfo, existingDbName, onUploadComplete } = props;
  const [overwriteDatabase, setOverwriteDatabase] = React.useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState();

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    /*
        accept: {
            'application/octet-stream': ['.dump']
        },
        */
    maxSize: getMaxSize(),
    onDropAccepted: async (acceptedFiles) => {
      //const req = request.post('/upload')

      if (acceptedFiles.length === 1) {
        try {
          const fileToUpload = acceptedFiles[0];
          setIsUploading(true);
          const response = await uploadFile({
            selectedFile: fileToUpload,
            existingDbName: existingDbName,
            overwrite: overwriteDatabase,
          });
          setIsUploading(false);
          //console.log("response: " , response);
          if (onUploadComplete) {
            onUploadComplete(response);
          }
        } catch (e) {
          setIsUploading(false);
          setUploadError(`Error loading file: ${e}`);
        }
      } else {
        // TODO: change to dispatch
        setIsUploading(false);
        setUploadError('Only 1 file can be uploaded.');
      }

      //req.end(callback)
    },
    onDropRejected: async (fileRejections, event) => {
      setIsUploading(false);
      setUploadError('Maximum file upload size is 1GB. Larger size file please contact solutions@neo4j.com.');
    },
  });

  const handleChange = (event) => {
    setOverwriteDatabase(event.target.checked);
  };

  let fileStatus = '';
  if (uploadError) {
    fileStatus = (
      <>
        <SyncProblemIcon style={{ marginRight: '5px' }} />
        {uploadError}
      </>
    );
  } else {
    let filePath = acceptedFiles.length > 0 ? acceptedFiles[0].path : '';
    if (filePath) {
      if (isUploading) {
        fileStatus = (
          <>
            <SyncIcon style={{ marginRight: '5px' }} />
            {`Uploading file ${filePath}`}
          </>
        );
      } else {
        fileStatus = (
          <>
            <CheckCircleIcon style={{ marginRight: '5px' }} />
            {`Uploaded file ${filePath}`}
          </>
        );
      }
    }
  }

  // for later: file.size

  return (
    <section>
      {preInfo && (
        <>
          {preInfo}
          {existingDbName && (
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={overwriteDatabase} onChange={handleChange} />}
                label='Overwrite?'
              />
            </FormGroup>
          )}
        </>
      )}
      <div {...getRootProps({ className: preInfo && existingDbName ? 'dropzoneShorter' : 'dropzone' })}>
        <div>
          <input {...getInputProps()} />
          <div>{props.message}</div>
        </div>
        <div style={{ display: 'flex' }}>{fileStatus}</div>
      </div>
      {isUploading && <LinearProgress className='progessBar' />}
    </section>
  );
}
