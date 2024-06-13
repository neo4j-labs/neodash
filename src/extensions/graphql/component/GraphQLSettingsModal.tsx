import React from 'react';
import { connect } from 'react-redux';
import { setClientSettings } from '../state/GraphQLActions';
import { getSettings } from '../state/GraphQLSelector';
import { Dialog } from '@neo4j-ndl/react';
import { Button, IconButton, TextInput } from '@neo4j-ndl/react';
import { encryptString } from '../Util';

const GraphQLSettingsModal = ({
  open,
  setOpen,
  clientSettings,
  updateClientSettings,
  // initializeModelClient,
}) => {
  const [apiKey, setApiKey] = React.useState();
  const [url, setUrl] = React.useState();
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
        <Dialog.Header id='form-dialog-title'>GraphQL Configuration</Dialog.Header>
        <Dialog.Content>
          This is to invoke GraphQL endpoints in your report.
          <br />
          <br />
          <TextInput
            style={{ marginLeft: '0', marginRight: '0' }}
            label='GraphQL Endpoint URL'
            value={settings.endpointUrl}
            onChange={(e) => setUrl(e.target.value)}
          />
          <br />
          <TextInput
            style={{ marginLeft: '0', marginRight: '0' }}
            label='GraphQL Endpoint API Key'
            value={settings.apiKey}
            onChange={(e) => setApiKey(encryptString(e.target.value))}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(GraphQLSettingsModal);
