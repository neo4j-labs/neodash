import DvrIcon from '@material-ui/icons/Dvr';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import NeoWorkflowListModal from './WorkflowListModal';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoWorkflowDrawerButton = () => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const button = (
    <div>
      <ListItem button onClick={handleClick} id='workflows-sidebar-button'>
        <ListItemIcon>
          <SlowMotionVideoIcon />
        </ListItemIcon>
        <ListItemText primary='Workflows' />
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
