import React from 'react';
import { connect } from 'react-redux';
import { SideNavigationItem } from '@neo4j-ndl/react';
import QueryBuilderModal from './QueryBuilderModal';
import { Tooltip } from '@mui/material';
import { BuildingLibraryIconSolid } from '@neo4j-ndl/react/icons';

export const QueryBuilderButton = () => {
  const [open, setOpen] = React.useState(false);

  const button = (
    <div>
      <Tooltip title='Query Builder' aria-label='q-builder'>
        <SideNavigationItem
          onClick={() => setOpen(true)}
          icon={
            <BuildingLibraryIconSolid
            // className={navItemClass}
            />
          }
        >
          Query Builder
        </SideNavigationItem>
      </Tooltip>
    </div>
  );

  const component = (
    <div>
      {button}
      {open ? <QueryBuilderModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryBuilderButton);
