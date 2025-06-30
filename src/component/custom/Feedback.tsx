import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton } from '@neo4j-ndl/react';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { filesToBase64 } from '../../utils/shareUtils';
const closeIcon = '/x-button.png';
const supportIcon = '/support.png';

interface FeedbackErrors {
  name?: string;
  email?: string;
  description?: string;
  files?: string;
}

const Feedback = () => {
  const [showModal, setShowModal] = useState(false);
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState<FeedbackErrors>({
    name: undefined,
    email: undefined,
    description: undefined,
    files: undefined,
  });
  const TIMEOUT_DURATION = 1000;
  const MAX_DESCRIPTION_LENGTH = 500;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const dbQueryUrl = `${window.location.origin}/oupt/api`;
  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setEmailStatus('Fetching data from profile...');
      try {
        const userInfo = await axios.get(`${dbQueryUrl}/v1/userInfo`);
        if (userInfo && userInfo.data.email && userInfo.data.email.length > 0) {
          setReporterEmail(userInfo.data.email);
          setReporterName(userInfo.data.userName);
          setEmailStatus('Email autofilled from profile.');
        } else {
          throw new Error('Email not found');
        }
      } catch {
        setEmailStatus('Failed to fetch profile. Please enter manually.');
      }
    };
    fetchUserInfo();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const resetForm = () => {
    setReporterName('');
    setReporterEmail('');
    setEmailStatus('');
    setDescription('');
    setAttachments(null);
    setIsError(false);
    setIsSuccess(false);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
      newErrors.email = 'Invalid email address';
    }
    if (!reporterName.trim()) {
      newErrors.name = 'Name should not be empty';
    }
    if (!description.trim()) {
      newErrors.description = 'Description should not be empty';
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (attachments) {
      let totalSize = 0;
      for (let i = 0; i < attachments.length; i++) {
        totalSize += attachments[i].size;
        if (totalSize > MAX_FILE_SIZE) {
          newErrors.files = `Total attachments files size must be less than 2 MB! Currently files size is ${(
            totalSize /
            (1024 * 1024)
          ).toFixed(2)} MB`;
          break;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const reporterContact = {
          email: reporterEmail,
          name: reporterName,
        };
        const base64EncodedFiles = attachments ? await filesToBase64(attachments) : null;
        const requestBody = {
          contact: reporterContact,
          description: description,
          attachments: base64EncodedFiles,
          source: window.location.href
        };
        console.log("URL is ", `${dbQueryUrl}/v1/send-feedback`);
        await axios
          .post(`${dbQueryUrl}/v1/send-feedback`, requestBody, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            resetForm();
            setIsSuccess(true);
          })
          .catch((err) => {
            console.error('Unable to submit feedback: ', err);
            setIsError(true);
          });
        closeModal();
      } catch (error) {
        console.error('Unable to submit feedback: ', error);
        setIsError(true);
      }
    }
  };

  return (
    <>
      <Tooltip title={'Report a bug/share feedback'} aria-label='Report a bug/share feedback' disableInteractive>
        <IconButton
          onClick={openModal}
          aria-label={'Report a bug/share feedback'}
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
        >
          <img src={supportIcon} alt='Report button' style={{ width: 20, height: 20 }} />
        </IconButton>
      </Tooltip>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSuccess}
        autoHideDuration={TIMEOUT_DURATION}
        onClose={() => setIsSuccess(false)}
      >
        <Alert severity='success' variant='filled' sx={{ width: '100%' }}>
          Feedback submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isError}
        autoHideDuration={TIMEOUT_DURATION}
        onClose={() => setIsError(false)}
      >
        <Alert severity='error' variant='filled' sx={{ width: '100%' }}>
          Feedback submission failed. Please try again.
        </Alert>
      </Snackbar>

      <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby='feedback-modal-title'
        aria-describedby='feedback-modal-description'
      >
        <Box sx={modalStyle}>
          <div className='modal-close-wrapper' onClick={closeModal} style={{ cursor: 'pointer', float: 'right' }}>
            <img className='modal-closed' src={closeIcon} alt='close icon' />
          </div>
          <h4 id='feedback-modal-title' className='modal-title'>
            Report a Bug / Share Feedback
          </h4>
          <hr />
          <br />

          <form onSubmit={submitFeedback} noValidate>
            <label>
              Reporter Name
              <input
                type='text'
                className='input-style'
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder='John'
                required
              />
              {errors.name && <div style={{ color: 'red', fontStyle: 'italic' }}>{errors.name}</div>}
            </label>
            <label>
              Reporter Email
              <input
                type='email'
                className='input-style'
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder='your.email@example.com'
                required
              />
              {errors.email && <div style={{ color: 'red', fontStyle: 'italic' }}>{errors.email}</div>}
              {emailStatus && <small style={{ color: 'lightgray', fontStyle: 'italic'}}>{emailStatus}</small>}
            </label>

            <label style={{ marginTop: '1em' }}>
              Description
              <textarea
                className='input-style'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder='Provide detailed info about the issue including issue description, relavant links, steps to reproduce.'
                required
              ></textarea>
              {errors.description && <div style={{ color: 'red', fontStyle: 'italic' }}>{errors.description}</div>}
            </label>

            <label
              style={{
                marginTop: '1em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Attach screenshot
              <input type='file' onChange={handleFileChange} multiple />
            </label>
            {errors.files && <div style={{ color: 'red', fontStyle: 'italic' }}>{errors.files}</div>}

            <div
              className='btn'
              style={{
                marginTop: '2em',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1em',
              }}
            >
              <Button onClick={closeModal}>Cancel</Button>
              <Button style={{ padding: '10px 24px' }} type='submit'>
                Submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Feedback;
