import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { InputBase } from '@material-ui/core';
import { IconButton } from '@neo4j-ndl/react';
import CloseIcon from '@material-ui/icons/Close';
import { NeoDeletePageModal } from '../../modal/DeletePageModal';
import { XMarkIconOutline } from '@neo4j-ndl/react/icons';

export const NeoPageButton = ({ title, disabled = false, selected = false, onSelect, onRemove, onTitleUpdate }) => {
  // TODO - debounce page title update
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const [titleText, setTitleText] = React.useState(title);
  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (titleText !== title) {
      setTitleText(title);
    }
  }, [title]);

  const content = (
    <>
      <Grid style={{ height: '100%' }} onClick={onSelect} container spacing={1} alignItems='flex-end'>
        <Grid item key={1} style={{ width: '100%' }}>
          <InputBase
            value={titleText}
            onChange={(event) => {
              if (disabled) {
                return;
              }
              onTitleUpdate(event);
              setTitleText(event.target.value);
            }}
            onFocus={(e) => {
              if (disabled) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            readOnly={disabled}
            inputProps={{ style: { textTransform: 'none', cursor: 'pointer', fontWeight: 'normal' } }}
            style={{
              height: '36px',
              width: '100%',
              paddingLeft: '10px',
              color: selected ? 'black' : '#888',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
            placeholder='Page name...'
          />
        </Grid>
      </Grid>
      <div
        style={{
          position: 'absolute',
          top: 5,
          right: 0,
          paddingRight: 3,
          background: selected ? 'white' : 'transparent',
        }}
      >
        {selected && !disabled ? (
          <IconButton aria-label='move left' onClick={() => setModalOpen(true)} clean>
            <XMarkIconOutline className='n-w-6 n-h-6' />
          </IconButton>
        ) : (
          <IconButton style={{ opacity: 0 }} aria-label='move left' onClick={(_) => null} clean>
            <XMarkIconOutline className='n-w-6 n-h-6' />
          </IconButton>
        )}
      </div>
      <NeoDeletePageModal modalOpen={modalOpen} onRemove={onRemove} handleClose={handleClose}></NeoDeletePageModal>
    </>
  );
  return content;
};

export default NeoPageButton;
