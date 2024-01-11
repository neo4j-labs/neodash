import React, { useEffect } from 'react';
import { Badge, CardHeader, Dialog, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { replaceDashboardParameters } from '../../chart/ChartUtils';

import { IconButton } from '@neo4j-ndl/react';
import {
  DragIcon,
  EllipsisVerticalIconOutline,
  ArrowPathIconOutline,
  ExpandIcon,
  ShrinkIcon,
  CameraIconSolid,
  InformationCircleIconOutline,
  XMarkIconOutline,
} from '@neo4j-ndl/react/icons';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const NeoCardViewHeader = ({
  title,
  description,
  editable,
  onTitleUpdate,
  fullscreenEnabled,
  downloadImageEnabled,
  refreshButtonEnabled,
  onToggleCardSettings,
  onManualRefreshCard,
  onDownloadImage,
  onToggleCardExpand,
  expanded,
  parameters,
}) => {
  const [text, setText] = React.useState(title);
  const [parsedText, setParsedText] = React.useState(title);
  const [editing, setEditing] = React.useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = React.useState(false);

  function replaceParamsOnString(s, p) {
    let parsed: string;
    parsed = replaceDashboardParameters(s, p);
    return parsed;
  }

  // Ensure that we only trigger a text update event after the user has stopped typing.
  const debouncedTitleUpdate = useCallback(debounce(onTitleUpdate, 250), []);

  useEffect(() => {
    let titleParsed = replaceParamsOnString(`${title}`, parameters);
    if (!editing) {
      setParsedText(titleParsed);
    }
  }, [editing, parameters]);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (text !== title) {
      setText(title);
    }
  }, [title]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Nunito Sans', sans-serif !important",
      allVariants: { color: 'rgb(var(--palette-neutral-text-weak))' },
    },
    palette: {
      text: {
        primary: 'rgb(var(--palette-neutral-text))',
      },
      action: {
        disabled: 'rgb(var(--palette-neutral-text-weak))',
      },
    },
  });

  const cardTitle = (
    <ThemeProvider theme={theme}>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {editable ? (
              <td>
                <IconButton
                  className='n-mb-3 n-relative -n-left-3 drag-handle'
                  clean
                  size='medium'
                  aria-label={'drag'}
                  onClick={() => {}}
                >
                  <DragIcon />
                </IconButton>
              </td>
            ) : (
              <></>
            )}
            <td style={{ width: '100%' }}>
              <TextField
                id='standard-outlined'
                onFocus={() => {
                  setEditing(true);
                }}
                onBlur={() => {
                  setEditing(false);
                }}
                className={'no-underline large'}
                label=''
                disabled={!editable}
                placeholder='Report name...'
                fullWidth
                maxRows={4}
                value={editing ? text : parsedText !== ' ' ? parsedText : ''}
                onChange={(event) => {
                  setText(event.target.value);
                  debouncedTitleUpdate(event.target.value);
                }}
                size={'small'}
                style={{ paddingTop: '0px important!' }}
                variant={'standard'}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                  },
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </ThemeProvider>
  );

  const descriptionEnabled = description && description.length > 0;

  // TODO: all components like buttons should probably be seperate files
  const settingsButton = (
    <Tooltip title='Settings' aria-label='settings' disableInteractive>
      <IconButton aria-label='settings' onClick={onToggleCardSettings} clean size='medium'>
        <EllipsisVerticalIconOutline />
      </IconButton>
    </Tooltip>
  );

  const refreshButton = (
    <Tooltip title='Refresh' aria-label='refresh' disableInteractive>
      <IconButton aria-label='refresh' onClick={onManualRefreshCard} clean size='medium'>
        <ArrowPathIconOutline />
      </IconButton>
    </Tooltip>
  );

  const maximizeButton = (
    <Tooltip title='Maximize' aria-label='maximize' disableInteractive>
      <IconButton aria-label='maximize' onClick={onToggleCardExpand} clean size='medium'>
        <ExpandIcon />
      </IconButton>
    </Tooltip>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand} clean size='medium'>
      <ShrinkIcon />
    </IconButton>
  );

  const downloadImageButton = (
    <Tooltip title='Download as Image' aria-label='download' disableInteractive>
      <IconButton onClick={onDownloadImage} aria-label='download csv' clean size='medium'>
        <CameraIconSolid />
      </IconButton>
    </Tooltip>
  );

  const descriptionButton = (
    <Tooltip title='Details' aria-label='details' disableInteractive>
      <IconButton onClick={() => setDescriptionModalOpen(true)} aria-label='details' clean size='medium'>
        <InformationCircleIconOutline />
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <Dialog
        maxWidth={'lg'}
        open={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {title}
          <IconButton
            onClick={() => setDescriptionModalOpen(false)}
            style={{ padding: '3px', float: 'right' }}
            aria-label={'rect badge'}
            clean
          >
            <XMarkIconOutline />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          <div>
            <base target='_blank' /> <ReactMarkdown plugins={[gfm]} children={description} />
          </div>
        </DialogContent>
      </Dialog>
      <CardHeader
        style={{ height: '72px' }}
        action={
          <>
            {downloadImageEnabled ? downloadImageButton : <></>}
            {fullscreenEnabled ? expanded ? unMaximizeButton : maximizeButton : <></>}
            {descriptionEnabled ? descriptionButton : <></>}
            {refreshButtonEnabled ? refreshButton : <></>}
            {editable ? settingsButton : <></>}
          </>
        }
        title={cardTitle}
      />
    </>
  );
};

export default NeoCardViewHeader;
