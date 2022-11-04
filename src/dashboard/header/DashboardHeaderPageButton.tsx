import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IconButton, InputBase } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { NeoDeletePageModal } from '../../modal/DeletePageModal';

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
      <Grid style={{ height: '100%' }} onClick={onSelect} container spacing={1} alignItems="flex-end">
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
            placeholder="Page name..."
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
          <IconButton
            size="medium"
            style={{ padding: '5px', color: 'white' }}
            aria-label="move left"
            onClick={() => setModalOpen(true)}
          >
            <CloseIcon color="disabled" />
          </IconButton>
        ) : (
          <IconButton
            size="medium"
            style={{ opacity: 0, padding: '5px', color: 'white' }}
            aria-label="move left"
            onClick={() => null}
          >
            <CloseIcon color="disabled" />
          </IconButton>
        )}
      </div>
      <NeoDeletePageModal modalOpen={modalOpen} onRemove={onRemove} handleClose={handleClose}></NeoDeletePageModal>
    </>
  );
  return content;
};

export default NeoPageButton;
