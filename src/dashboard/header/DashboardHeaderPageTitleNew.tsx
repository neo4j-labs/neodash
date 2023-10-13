import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { setPageTitle } from '../../page/PageActions';
import { removePageThunk } from '../DashboardThunks';
import { Tab, Menu, MenuItems, MenuItem, IconButton, TextInput } from '@neo4j-ndl/react';
import { EllipsisHorizontalIconOutline, PencilIconOutline, TrashIconOutline } from '@neo4j-ndl/react/icons';
import { NeoDeletePageModal } from '../../modal/DeletePageModal';
import { SortableList } from '../../component/misc/NeoSortableList';

export const DashboardHeaderPageTitle = ({
  title,
  tabIndex,
  removePage,
  setPageTitle,
  disabled = false,
  editing = false,
  setEditing,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const menuOpen = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleMenuEditClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    if (editing) {
      debouncedSetPageTitle(tabIndex, titleText);
    }
    setEditing(tabIndex, !editing);
    setAnchorEl(null);
  };

  const handleDeleteModalClose = () => {
    setAnchorEl(null);
    setDeleteModalOpen(false);
  };

  const debouncedSetPageTitle = useCallback(debounce(setPageTitle, 250), []);

  const [titleText, setTitleText] = React.useState(title);
  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (titleText !== title) {
      setTitleText(title);
    }
  }, [title]);

  const content = (
    <div className='n-inline-flex' id={`tab_${tabIndex}`}>
      <Tab tabId={tabIndex} key={tabIndex} className={editing ? 'n-inline-flex' : ''}>
        <SortableList.DragHandle />
        {!editing ? (
          title
        ) : (
          <TextInput
            data-no-dnd='true'
            autoFocus={true}
            value={titleText}
            onChange={(event) => {
              if (disabled) {
                return;
              }
              setTitleText(event.target.value);
            }}
            style={{
              textAlign: 'center',
              height: '1.9rem',
            }}
            placeholder='Page name...'
          />
        )}
        {!disabled && (
          <>
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
                <MenuItem
                  icon={<PencilIconOutline />}
                  title={editing ? 'Stop Editing' : 'Edit name'}
                  onClick={(e) => {
                    e.stopPropagation();
                    !disabled && handleMenuEditClick(e);
                  }}
                />
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
          </>
        )}
      </Tab>
      <NeoDeletePageModal
        modalOpen={deleteModalOpen}
        onRemove={() => removePage(tabIndex)}
        handleClose={handleDeleteModalClose}
      />
    </div>
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
