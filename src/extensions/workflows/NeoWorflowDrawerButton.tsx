import EmojiNatureIcon from '@material-ui/icons/EmojiNature';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import NeoWorkflowListModal from './WorkflowListModal';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoWorkflowDrawerButton = () => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const button = (
    <div>
      <ListItem button onClick={handleClick} id='alert-sidebar-button'>
        <ListItemIcon>
          <EmojiNatureIcon />
        </ListItemIcon>
        <ListItemText primary='Alerts' />
      </ListItem>
    </div>
  );
  return (
    <>
      {button}
      {open ? <NeoWorkflowListModal open={true} setOpen={setOpen}></NeoWorkflowListModal> : <></>}
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoWorkflowDrawerButton);
