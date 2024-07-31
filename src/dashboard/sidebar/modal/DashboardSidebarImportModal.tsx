import React, { useRef } from 'react';
import { PlayIconSolid, DocumentPlusIconOutline } from '@neo4j-ndl/react/icons';
import { Button, Checkbox, Dialog, Dropdown } from '@neo4j-ndl/react';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export const NeoDashboardSidebarImportModal = ({ open, onImport, handleClose }) => {
  const [text, setText] = React.useState('');
  const loadFromFile = useRef(null);

  const onSelectFileClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files == null) {
      return;
    }

    const file = e.target.files[0];
    const text = await file.text();

    setText(text);
  };

  return (
    <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Import Dashboard</Dialog.Header>
      <Dialog.Content>
        Import your dashboard from a JSON file, or copy-paste the save file here.
        <br />
        <b>Importing will discard your current draft, if any.</b>
        <br /> <br />
      </Dialog.Content>
      <TextareaAutosize
        style={{ minHeight: '200px', width: '100%', border: '1px solid lightgray' }}
        className={'textinput-linenumbers'}
        onChange={(e) => setText(e.target.value)}
        value={text}
        aria-label=''
        placeholder='Paste a dashboard JSON file here...'
      />
      <Dialog.Actions>
        <Button
          onClick={() => {
            loadFromFile.current.click();
          }}
          fill='outlined'
          color='neutral'
          style={{ marginLeft: '10px' }}
          floating
        >
          <input value='' type='file' ref={loadFromFile} onChange={onSelectFileClick} hidden />
          Select From File
          <DocumentPlusIconOutline className='btn-icon-base-r' />
        </Button>
        <Button
          onClick={() => {
            onImport(text);
            setText('');
            handleClose();
          }}
          color={text.length > 0 ? 'success' : 'neutral'}
          disabled={text.length == 0}
          style={{ float: 'right', marginRight: '10px' }}
          floating
        >
          Import
          <PlayIconSolid className='btn-icon-base-r' />
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardSidebarImportModal;
