import React, { useState } from 'react';

import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { Button } from '@mui/material';

import { getDynamicConfigValue } from '../../config/dynamicConfig';

export default function Chat() {
  const urlParams = new URLSearchParams(window.location.search);
  const chatEnabledUrlString = urlParams.get('genAiChatEnabled');
  const genAiUrlString = urlParams.get('genAiUrl');

  let chatEnabled = getDynamicConfigValue('REACT_APP_GEN_AI_CHAT_ENABLED');
  if (chatEnabledUrlString) {
    if (chatEnabledUrlString === 'true') {
      chatEnabled = true;
    } else {
      chatEnabled = false;
    }
  }

  let genAiUrl = getDynamicConfigValue('REACT_APP_GEN_AI_URL');
  if (genAiUrlString) {
    genAiUrl = genAiUrlString;
  }

  const [fullScreen, setFullScreen] = useState(false);
  const [chatVisible, setChatVisible] = useState('hidden');

  const toggleChat = () => {
    if (chatVisible === 'hidden') {
      setChatVisible('visible');
    } else if (chatVisible === 'visible') {
      setChatVisible('hidden');
    }
  };

  const toggleFullScreen = () => setFullScreen(!fullScreen);

  return chatEnabled ? (
    <>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          visibility: chatVisible,
          right: 20,
          bottom: 60,
          height: fullScreen ? 'calc(100vh - 140px)' : 'calc(50vh - 70px)',
          width: '92vw',
          zIndex: 101,
          borderRadius: '5px',
          border: '2px solid #ddd',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
          }}
        >
          <div
            style={{
              flexGrow: 0,
              display: 'flex',
              width: '100%',
              height: '30px',
              padding: '5px',
              background: '#eee',
            }}
          >
            <div
              style={{
                flexGrow: 1,
                textAlign: 'left',
                marginTop: '-2px',
              }}
            >
              Chat
            </div>
            <div
              style={{
                flexGrow: 0,
                display: 'flex',
                flexFlow: 'row',
                marginTop: '-2px',
                cursor: 'pointer',
                width: '50px',
              }}
            >
              <div
                style={
                  {
                    // marginTop: '2px'
                  }
                }
                onClick={() => toggleFullScreen()}
              >
                {fullScreen ? (
                  <CloseFullscreenIcon style={{ fontSize: '1.1rem' }} />
                ) : (
                  <OpenInFullIcon style={{ fontSize: '1.1rem' }} />
                )}
              </div>
              <div onClick={() => setChatVisible('hidden')}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div
            style={{
              flexGrow: 1,
              width: '100%',
            }}
          >
            <iframe
              style={{
                width: '100%',
                height: '100%',
                borderWidth: '0px',
              }}
              id='genAIChat'
              title='GenAI Embed'
              src={genAiUrl}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          right: 20,
          bottom: 20,
          height: 40,
          width: 100,
          zIndex: 100,
        }}
      >
        <Button variant='contained' color='primary' onClick={toggleChat} fullWidth startIcon={<ForumIcon />}>
          Chat
        </Button>
      </div>
    </>
  ) : (
    <></>
  );
}
