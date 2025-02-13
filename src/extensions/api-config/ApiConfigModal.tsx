import React, { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import { PlusIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingName: string;
  settingValue: ApiConfig;
  onReportSettingUpdate: (settingName: string, config: ApiConfig) => void;
}

interface ApiConfig {
  apiEnabled: boolean;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | '';
  params?: { key: string; value: string }[];
}

const NeoApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  settingName,
  settingValue,
  onReportSettingUpdate,
}) => {
  const [config, setConfig] = useState<ApiConfig>({
    apiEnabled: true,
    endpoint: '',
    method: '',
    params: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    onReportSettingUpdate(settingName, config);
    onClose();
  };

  const handleAddParam = () => {
    setConfig((prevConfig: ApiConfig) => ({
      ...prevConfig,
      params: [...(prevConfig.params || []), { key: '', value: '' }],
    }));
  };

  const handleParamChange = (index: number, key: string, value: string) => {
    setConfig((prevConfig) => {
      const updatedParams = [...(prevConfig.params || [])];
      updatedParams[index] = { key, value };
      return { ...prevConfig, params: updatedParams };
    });
  };

  const handleDeleteParam = (index: number) => {
    setConfig((prevConfig) => {
      const updatedParams = [...(prevConfig.params || [])];
      updatedParams.splice(index, 1);
      return { ...prevConfig, params: updatedParams };
    });
  };

  useEffect(() => {
    if (settingValue) {
      setConfig(settingValue);
    }
  }, [settingValue]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>API Spec</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={config.apiEnabled}
              name='apiEnabled'
              onChange={(e) => handleSwitch(e as React.ChangeEvent<HTMLInputElement>)}
            />
          }
          label='Enable API Call'
        />
        <TextField
          label='Endpoint'
          fullWidth
          variant='outlined'
          name='endpoint'
          value={config.endpoint}
          onChange={handleInputChange}
          margin='normal'
        />
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Method</InputLabel>
          <Select
            label='Method'
            value={config.method}
            onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
            fullWidth
            variant='outlined'
            margin='none'
            name='method'
          >
            <MenuItem value='GET'>GET</MenuItem>
            <MenuItem value='POST'>POST</MenuItem>
            <MenuItem value='PUT'>PUT</MenuItem>
            <MenuItem value='PATCH'>PATCH</MenuItem>
            <MenuItem value='DELETE'>DELETE</MenuItem>
          </Select>
        </FormControl>

        <List>
          <ListItem
            secondaryAction={
              <IconButton edge='end' aria-label='add params' onClick={handleAddParam}>
                <PlusIconOutline />
              </IconButton>
            }
          >
            <ListItemText primary='Add Params' />
          </ListItem>
          {(config.params || []).map((param, index) => (
            <ListItem key={index}>
              <Stack direction='row' spacing={2}>
                <TextField
                  label='Key'
                  variant='outlined'
                  size='small'
                  value={param.key}
                  onChange={(e) => handleParamChange(index, e.target.value, param.value)}
                />
                <TextField
                  label='Value'
                  variant='outlined'
                  size='small'
                  value={param.value}
                  onChange={(e) => handleParamChange(index, param.key, e.target.value)}
                />
              </Stack>
              <ListItemSecondaryAction>
                <IconButton aria-label='delete params' onClick={() => handleDeleteParam(index)}>
                  <TrashIconOutline />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NeoApiConfigModal;
