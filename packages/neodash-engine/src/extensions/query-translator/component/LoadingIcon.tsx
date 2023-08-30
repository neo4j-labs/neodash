import React from 'react';

export const GPT_LOADING_ICON = (
  <div className='centered' style={{ textAlign: 'center' }}>
    <br />
    <img
      style={{ width: 40, animation: 'pulse 2s infinite', marginTop: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
      src={'OpenAiLogo.png'}
    ></img>
    <br />
    <span style={{ fontSize: 12 }}>Calling OpenAI...</span>
  </div>
);
