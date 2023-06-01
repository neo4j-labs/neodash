import { Badge, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setClientSettings, setModelProvider } from '../state/QueryTranslatorActions';
import { getApiKey, getClientSettings, getModelProvider } from '../state/QueryTranslatorSelector';
import SaveIcon from '@mui/icons-material/Save';
import { SELECTION_TYPES } from '../../../config/CardConfig';
import NeoSetting from '../../../component/field/Setting';
import { QUERY_TRANSLATOR_CONFIG } from '../QueryTranslatorConfig';
import ClientSettings from './ClientSettings';

export const QueryTranslatorSettingsModal = ({
  open,
  setOpen,
  apiKey,
  modelProvider,
  clientSettings,
  updateClientSettings,
  updateModelProvider,
}) => {
  const [modelProviderState, setModelProviderState] = React.useState(modelProvider);
  const [apiKeyState, setApiKeyState] = React.useState(apiKey);
  const [settingsState, setSettingsState] = React.useState(clientSettings);
  const handleClose = () => {
    updateModelProvider(modelProviderState);
    updateClientSettings(settingsState);
    setOpen(false);
  };

  return (
    <Dialog maxWidth={'md'} scroll={'paper'} open={open} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Henlo
        <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
          <Badge overlap='rectangular' badgeContent={''}>
            <SaveIcon id={'extensions-modal-close-button'} />
          </Badge>
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ width: '750px' }}>
        <div>
          Select your model provider:
          <NeoSetting
            key={'Model Provider'}
            name={'Model Provider'}
            label={'Model Provider'}
            value={modelProviderState}
            type={SELECTION_TYPES.LIST}
            choices={Object.keys(QUERY_TRANSLATOR_CONFIG.availableClients)}
            onChange={(e) => setModelProviderState(e)}
          />
          <br />
          {modelProviderState ? (
            <ClientSettings
              modelProvider={modelProviderState}
              settingState={settingsState}
              setSettingsState={setSettingsState}
            />
          ) : (
            <>Select one of the available clients.</>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
const mapStateToProps = (state) => ({
  apiKey: getApiKey(state),
  clientSettings: getClientSettings(state),
  modelProvider: getModelProvider(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateClientSettings: (settings) => dispatch(setClientSettings(settings)),
  updateModelProvider: (modelProvider) => dispatch(setModelProvider(modelProvider)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorSettingsModal);
