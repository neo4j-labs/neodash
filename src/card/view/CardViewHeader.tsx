import React, { useEffect } from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import { Badge, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ImageIcon from '@material-ui/icons/Image';
import CloseIcon from '@material-ui/icons/Close';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const NeoCardViewHeader = ({
  title,
  description,
  editable,
  onTitleUpdate,
  fullscreenEnabled,
  downloadImageEnabled,
  onToggleCardSettings,
  onDownloadImage,
  onToggleCardExpand,
  expanded,
}) => {
  const [text, setText] = React.useState(title);
  const [descriptionModalOpen, setDescriptionModalOpen] = React.useState(false);

  // Ensure that we only trigger a text update event after the user has stopped typing.
  const debouncedTitleUpdate = useCallback(debounce(onTitleUpdate, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (text !== title) {
      setText(title);
    }
  }, [title]);

  const cardTitle = (
    <>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            {editable ? (
              <td>
                <DragIndicatorIcon
                  className='drag-handle'
                  style={{ color: 'grey', cursor: 'pointer', marginLeft: '-10px', marginRight: '10px' }}
                ></DragIndicatorIcon>
              </td>
            ) : (
              <></>
            )}
            <td style={{ width: '100%' }}>
              <TextField
                id='standard-outlined'
                className={'no-underline large'}
                label=''
                disabled={!editable}
                placeholder='Report name...'
                fullWidth
                maxRows={4}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  debouncedTitleUpdate(event.target.value);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const descriptionEnabled = description && description.length > 0;

  // TODO: all components like buttons should probably be seperate files
  const settingsButton = (
    <Tooltip title='Settings' aria-label='settings'>
      <IconButton aria-label='settings' onClick={onToggleCardSettings}>
        <MoreVertIcon />
      </IconButton>
    </Tooltip>
  );

  const maximizeButton = (
    <Tooltip title='Maximize' aria-label='maximize'>
      <IconButton aria-label='maximize' onClick={onToggleCardExpand}>
        <FullscreenIcon />
      </IconButton>
    </Tooltip>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand}>
      <FullscreenExit />
    </IconButton>
  );

  const downloadImageButton = (
    <Tooltip title='Download as Image' aria-label='download'>
      <IconButton onClick={onDownloadImage} aria-label='download csv'>
        <ImageIcon style={{ fontSize: '1.3rem', zIndex: 5 }} fontSize='small'></ImageIcon>
      </IconButton>
    </Tooltip>
  );

  const descriptionButton = (
    <Tooltip title='Details' aria-label='details'>
      <IconButton onClick={() => setDescriptionModalOpen(true)} aria-label='details'>
        <InfoOutlinedIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <Dialog
        maxWidth={'lg'}
        open={descriptionModalOpen == true}
        onClose={() => setDescriptionModalOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {title}
          <IconButton onClick={() => setDescriptionModalOpen(false)} style={{ padding: '3px', float: 'right' }}>
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
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
            {editable ? settingsButton : <></>}
          </>
        }
        title={cardTitle}
      />
    </>
  );
};

export default NeoCardViewHeader;
