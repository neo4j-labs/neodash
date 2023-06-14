import React from 'react';

export const GPT_LOADING_ICON = (
  <div className='centered' style={{ textAlign: 'center' }}>
    <br />
    <img
      style={{ width: 40, animation: 'pulse 2s infinite', marginTop: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
      src='https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'
    ></img>
    <br />
    <span style={{ fontSize: 12 }}>Calling OpenAI...</span>
  </div>
);
