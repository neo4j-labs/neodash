import React from 'react';
import { connect } from 'react-redux';
import { setClientSettings } from '../state/KeymakerActions';
import { getSettings } from '../state/KeymakerSelector';
import { Dialog } from '@neo4j-ndl/react';
import { Button, IconButton, TextInput } from '@neo4j-ndl/react';
// import { encryptString } from '../Util';

const KeymakerSettingsModal = ({
  open,
  setOpen,
  clientSettings,
  updateClientSettings,
  // initializeModelClient,
}) => {
  const [apiKey, setApiKey] = React.useState(clientSettings?.apiKey || '');
  const [url, setUrl] = React.useState(clientSettings?.endpointUrl || '');
  const [settings, setSettings] = React.useState(clientSettings);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);

  const handleCloseWithSave = () => {
    setSettings({
      apiKey: apiKey,
      endpointUrl: url,
    });
    updateClientSettings({
      apiKey: apiKey,
      endpointUrl: url,
    });
    setOpen(false);
    // initializeModelClient();
  };

  const handleCloseWithoutSave = () => {
    setOpen(false);
  };

  const handleOpenEditSolutions = () => {
    setEditDialogIsOpen(true);
  };

  const handleCloseEditSolutions = () => {
    setEditDialogIsOpen(false);
  };

  if (!editDialogIsOpen) {
    return (
      <Dialog size='large' open={open} onClose={handleCloseWithoutSave} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>Keymaker Configuration</Dialog.Header>
        <Dialog.Content>
          This is to invoke Keymaker endpoints in your report.
          <br />
          <br />
          <div class='text-input-style' style={{ width: '100%' }}>
            <TextInput
              style={{ marginLeft: '0', marginRight: '0' }}
              label='Keymaker Endpoint URL'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <br />
          <div class='text-input-style' style={{ width: '100%' }}>
            <TextInput
              style={{ marginLeft: '0', marginRight: '0' }}
              label='Keymaker Endpoint API Key'
              value={apiKey}
              // onChange={(e) => setApiKey(encryptString(e.target.value))}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <br />
          <Button floating onClick={handleCloseWithSave}>
            Save
          </Button>
        </Dialog.Content>
      </Dialog>
    );
  }
};

const mapStateToProps = (state) => ({
  clientSettings: getSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateClientSettings: (settings) => {
    // alert(settings.apiKey);
    dispatch(setClientSettings(settings));
  },
  // initializeModelClient: (setIsAuthenticated) => {
  //   dispatch(modelClientInitializationThunk(setIsAuthenticated));
  // },
});

export default connect(mapStateToProps, mapDispatchToProps)(KeymakerSettingsModal);
