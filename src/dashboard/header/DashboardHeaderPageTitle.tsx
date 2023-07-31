import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import classname from 'classnames';
import debounce from 'lodash/debounce';
import { setPageTitle } from '../../page/PageActions';
import { removePageThunk } from '../DashboardThunks';
import { Tab, Menu, MenuItems, MenuItem, IconButton } from '@neo4j-ndl/react';
import { EllipsisHorizontalIconOutline, PencilIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';
import { removePage } from '../DashboardActions';

export const DashboardHeaderPageTitle = ({ title, tabIndex }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuEditClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
  };
  const handleMenuDeleteClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, i) => {
    event.stopPropagation();
    removePage(i);
  };

  const debouncedSetPageTitle = useCallback(debounce(setPageTitle, 250), []);

  const content = (
    <Tab tabId={tabIndex} key={tabIndex}>
      {title}
      <IconButton
        aria-label='Page actions'
        className={classname('n-relative n-top-1 visible-on-tab-hover', {
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
          <MenuItem icon={<PencilIconOutline />} title='Edit name' onClick={(e) => handleMenuEditClick(e, tabIndex)} />
          <MenuItem
            className='n-text-palette-danger-text'
            icon={<TrashIconOutline />}
            title='Delete'
            onClick={(e) => handleMenuDeleteClick(e, tabIndex)}
          />
        </MenuItems>
      </Menu>
    </Tab>
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

export default connect(mapDispatchToProps)(DashboardHeaderPageTitle);
