import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { setPageTitle } from '../../page/PageActions';
import { removePageThunk } from '../DashboardThunks';
import { Tab, Menu, MenuItems, MenuItem, IconButton } from '@neo4j-ndl/react';
import { EllipsisHorizontalIconOutline, PencilIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';
import { NeoDeletePageModal } from '../../modal/DeletePageModal';

export const DashboardHeaderPageTitle = ({ title, tabIndex, removePage, setPageTitle, disabled = false }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleMenuEditClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleDeleteModalClose = () => {
    setAnchorEl(null);
    setDeleteModalOpen(false);
  };

  const debouncedSetPageTitle = useCallback(debounce(setPageTitle, 250), []);

  const content = (
    <>
      <Tab tabId={tabIndex} key={tabIndex}>
        {title}
        <IconButton
          aria-label='Page actions'
          className={classnames('n-relative n-top-1 visible-on-tab-hover', {
            'open-menu': menuOpen,
          })}
          style={{ height: '1.1rem' }}
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          size='small'
          clean
        >
          <EllipsisHorizontalIconOutline />
        </IconButton>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
          <MenuItems>
            <MenuItem icon={<PencilIconOutline />} title='Edit name' onClick={(e) => handleMenuEditClick(e)} />
            <MenuItem
              className='n-text-palette-danger-text'
              icon={<TrashIconOutline />}
              title='Delete'
              onClick={(e) => {
                e.stopPropagation();
                !disabled && setDeleteModalOpen(true);
              }}
            />
          </MenuItems>
        </Menu>
      </Tab>
      <NeoDeletePageModal
        modalOpen={deleteModalOpen}
        onRemove={() => removePage(tabIndex)}
        handleClose={handleDeleteModalClose}
      />
    </>
  );

  return content;
};

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (number: any, title: any) => {
    dispatch(setPageTitle(number, title));
  },
  removePage: (index: any) => {
    dispatch(removePageThunk(index));
  },
});

export default connect(null, mapDispatchToProps)(DashboardHeaderPageTitle);
