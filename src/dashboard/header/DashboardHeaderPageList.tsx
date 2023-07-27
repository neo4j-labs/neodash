import { Toolbar } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import NeoPageButton from './DashboardHeaderPageButton';
import NeoPageAddButton from './DashboardHeaderPageAddButton';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getPages } from '../DashboardSelectors';
import debounce from 'lodash/debounce';
import { setPageTitle } from '../../page/PageActions';
import { addPageThunk, movePageThunk, removePageThunk } from '../DashboardThunks';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { setPageNumberThunk } from '../../settings/SettingsThunks';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import RGL, { WidthProvider } from 'react-grid-layout';
import { DASHBOARD_PAGE_LIST_COLOR, DASHBOARD_PAGE_LIST_ACTIVE_COLOR } from '../../config/ApplicationConfig';
import { Tabs, Tab, TabPanel, Menu, MenuItems, MenuItem, IconButton } from '@neo4j-ndl/react';
import {
  EllipsisHorizontalIconOutline,
  PencilIconOutline,
  PlusIconOutline,
  TrashIconOutline,
} from '@neo4j-ndl/react/icons';
const ReactGridLayout = WidthProvider(RGL);

/**
 * The component responsible for rendering the list of pages, as well as the logic for adding, removing, selecting and updating pages.
 */
export const NeoDashboardHeaderPageList = ({
  // standalone,
  editable,
  pages,
  pagenumber,
  addPage,
  // movePage,
  // removePage,
  // selectPage,
  // setPageTitle,
}) => {
  const [layout, setLayout] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [canSwitchPages, setCanSwitchPages] = React.useState(true);
  const [lastElement, setLastElement] = React.useState(<></>);

  // We debounce several state changes to improve user experience.
  // const debouncedSetCanSwitchPages = useCallback(debounce(setCanSwitchPages, 50), []);

  // const debouncedSetPageTitle = useCallback(debounce(setPageTitle, 250), []);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('open-menu');

    setAnchorEl(clickedElement);
  };
  const handleMenuClose = () => {
    anchorEl.classList.remove('open-menu');

    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  /**
   * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
   */
  function recomputeLayout() {
    const timestamp = Date.now();
    // @ts-ignore
    // setLayout([
    //   ...pages.map((page, index) => {
    //     return { x: index, y: 0, i: `${index}`, w: Math.min(2.0, 11.3 / pages.length), h: 1 };
    //   }),
    //   { x: pages.length, y: 0, i: `${timestamp}`, minW: 0.1, w: 0.1, h: 1, isDraggable: false },
    // ]);

    setLastElement(
      <IconButton className='n-relative -n-top-1' size='large' onClick={addPage} clean>
        <PlusIconOutline />
      </IconButton>
    );
  }

  useEffect(() => {
    recomputeLayout();
  }, [pages]);

  const content = (
    <div className='n-flex n-flex-row n-w-full'>
      <Tabs fill='underline' onChange={function Xa() {}} value={pagenumber}>
        {pages.map((page, i) => (
          <Tab tabId={i}>
            {page.title}
            <IconButton
              id='tab-0-menu'
              className='n-relative n-top-1 visible-on-tab-hover'
              style={{ height: '1.1rem' }}
              onClick={handleMenuClick}
              size='small'
              clean
            >
              <EllipsisHorizontalIconOutline />
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItems>
                <MenuItem icon={<PencilIconOutline />} onClick={function Xa() {}} title='Edit name' />
                <MenuItem
                  className='n-text-palette-danger-text'
                  icon={<TrashIconOutline />}
                  onClick={function Xa() {}}
                  title='Delete'
                />
              </MenuItems>
            </Menu>
          </Tab>
        ))}
      </Tabs>
      {editable && !isDragging ? lastElement : <></>}
    </div>

    //   <ReactGridLayout
    //     className='layout -n-z-50'
    //     layout={layout}
    //     isResizable={false}
    //     isDraggable={editable}
    //     onDrag={() => {
    //       if (!isDragging) {
    //         setCanSwitchPages(false);
    //         setIsDragging(true);
    //       }
    //     }}
    //     onDragStop={(newLayout, oldPosition, newPosition) => {
    //       // Calculate the old and new index of the page that was just dropped.
    //       const newXPositions = newLayout.map((page) => page.x);
    //       const oldIndex = oldPosition.i;
    //       const newIndex = Math.min(
    //         newXPositions.length - 2,
    //         newXPositions.sort((a, b) => a - b).indexOf(newPosition.x)
    //       );
    //       if (oldIndex !== newIndex) {
    //         movePage(oldIndex, newIndex);
    //         recomputeLayout();
    //       }
    //       setIsDragging(false);
    //       debouncedSetCanSwitchPages(true);
    //     }}
    //     style={{
    //       width: '100%',
    //       height: '47px',
    //       overflowY: 'hidden',
    //       overflowX: 'hidden',
    //       background: DASHBOARD_PAGE_LIST_COLOR,
    //       padding: 0,
    //       margin: 0,
    //       boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 15%)',
    //     }}
    //     margin={[0, 0]}
    //     maxRows={1}
    //     rowHeight={47}
    //     isBounded={true}
    //     compactType={'horizontal'}
    //   >
    //     {pages.map((page, i) => (
    //       <div
    //         key={i}
    //         style={{
    //           background: DASHBOARD_PAGE_LIST_COLOR,
    //           backgroundColor: pagenumber == i ? DASHBOARD_PAGE_LIST_ACTIVE_COLOR : 'inherit',
    //           display: 'inline-block',
    //           height: '100%',
    //           padding: 0,
    //           margin: 0,
    //           borderRight: '1px solid #ddd',
    //           borderLeft: '1px solid #ddd',
    //         }}
    //       >
    //         <NeoPageButton
    //           title={page.title}
    //           selected={pagenumber == i}
    //           disabled={!editable}
    //           onSelect={() => (canSwitchPages ? selectPage(i) : null)}
    //           onRemove={() => removePage(i)}
    //           onTitleUpdate={(e) => debouncedSetPageTitle(i, e.target.value)}
    //         />
    //       </div>
    //     ))}
    //     {editable && !isDragging ? lastElement : <></>}
    //   </ReactGridLayout>
    // </Toolbar>
  );
  return content;
};

const mapStateToProps = (state) => ({
  standalone: applicationIsStandalone(state),
  pages: getPages(state),
  editable: getDashboardIsEditable(state),
  pagenumber: getPageNumber(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },
  selectPage: (number: any) => {
    dispatch(setPageNumberThunk(number));
  },
  setPageTitle: (number: any, title: any) => {
    dispatch(setPageTitle(number, title));
  },
  addPage: () => {
    dispatch(addPageThunk());
  },
  removePage: (index: any) => {
    dispatch(removePageThunk(index));
  },
  movePage: (oldIndex: number, newIndex: number) => {
    dispatch(movePageThunk(oldIndex, newIndex));
  },
  onConnectionModalOpen: () => {
    dispatch(setConnectionModalOpen(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderPageList);
