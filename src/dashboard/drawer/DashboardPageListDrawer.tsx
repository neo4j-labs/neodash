import { Drawer, ListItem, Divider, ListItemText, List, debounce } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import { connect } from 'react-redux';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { getPages } from '../DashboardSelectors';
import { setPageTitle } from '../../page/PageActions';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { setPageNumberThunk } from '../../settings/SettingsThunks';
import { setDashboardTitle } from '../DashboardActions';
import { addPageThunk, removePageThunk, movePageThunk } from '../DashboardThunks';

import RGL, { WidthProvider } from 'react-grid-layout';
import NeoPageAddButton from '../header/DashboardHeaderPageAddButton';
import NeoPageButton from '../header/DashboardHeaderPageButton';
const ReactGridLayout = WidthProvider(RGL);

// The sidebar that appears on the left side of the dashboard.
export const NeoPageListDrawer = ({
  editable,
  pages,
  pagenumber,
  addPage,
  movePage,
  removePage,
  selectPage,
  setPageTitle,
}) => {
  // Override to hide the drawer when the application is in standalone mode.

  const [layout, setLayout] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [canSwitchPages, setCanSwitchPages] = React.useState(true);
  const [lastElement, setLastElement] = React.useState(<></>);

  // We debounce several state changes to improve user experience.
  const debouncedSetCanSwitchPages = useCallback(debounce(setCanSwitchPages, 50), []);

  const debouncedSetPageTitle = useCallback(debounce(setPageTitle, 250), []);

  /**
   * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
   */
  function recomputeLayout() {
    const timestamp = Date.now();
    // @ts-ignore
    if (pages) {
      setLayout([
        ...pages.map((page, index) => {
          return { x: index, y: 0, i: `${index}`, w: 12, h: 1 };
        }),
        { x: pages.length, y: 0, i: `${timestamp}`, w: 0.0001, h: 1, isDraggable: false },
      ]);
    }

    setLastElement(
      <div
        key={timestamp}
        style={{
          background: 'inherit',
          display: 'inline-block',
          padding: 0,
          margin: 0,
          height: '100%',
        }}
      >
        <NeoPageAddButton onClick={addPage}></NeoPageAddButton>
      </div>
    );
  }

  useEffect(() => {
    recomputeLayout();
  }, [pages]);

  const content = (
    <Drawer
      variant='permanent'
      style={{
        position: 'relative',
        overflowX: 'hidden',
        width: '240px',
        paddingTop: '60px',
        background: '#eee',
        transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
      }}
      open={true}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'hidden',
          justifyContent: 'flex-end',
          marginLeft: 0,
          background: '#eee',
          minHeight: '64px',
        }}
      >
        <Divider />
        <List>
          <ReactGridLayout
            className='layout'
            layout={layout}
            isResizable={false}
            isDraggable={editable}
            onDrag={() => {
              if (!isDragging) {
                setCanSwitchPages(false);
                setIsDragging(true);
              }
            }}
            onDragStop={(newLayout, oldPosition, newPosition) => {
              // Calculate the old and new index of the page that was just dropped.
              const newXPositions = newLayout.map((page) => page.x);
              const oldIndex = oldPosition.i;
              const newIndex = Math.min(
                newXPositions.length - 2,
                newXPositions.sort((a, b) => a - b).indexOf(newPosition.x)
              );
              if (oldIndex !== newIndex) {
                movePage(oldIndex, newIndex);
                recomputeLayout();
              }
              setIsDragging(false);
              debouncedSetCanSwitchPages(true);
            }}
            style={{
              width: '200px',
              height: '800px',
              overflowY: 'hidden',
              overflowX: 'hidden',
              padding: 0,
              margin: 0,
              boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
              borderBottom: '1px solid lightgrey',
            }}
            margin={[0, 0]}
            maxRows={100}
            rowHeight={60}
            isBounded={true}
            compactType={'vertical'}
          >
            {pages &&
              pages.map((page, i) => (
                <div
                  key={i}
                  style={{
                    background: '#eee',
                    height: '100%',
                  }}
                >
                  <ListItem>
                    <div
                      key={i}
                      style={{
                        backgroundColor: pagenumber == i ? 'white' : 'inherit',
                        display: 'inline-block',
                        padding: 0,
                        background: 'white',
                        margin: 0,
                        borderRight: '1px solid #ddd',
                        borderLeft: '1px solid #ddd',
                      }}
                    >
                      <NeoPageButton
                        title={page.title}
                        selected={pagenumber == i}
                        disabled={!editable}
                        onSelect={() => (canSwitchPages ? selectPage(i) : null)}
                        onRemove={() => removePage(i)}
                        onTitleUpdate={(e) => debouncedSetPageTitle(i, e.target.value)}
                      />
                    </div>
                  </ListItem>
                </div>
              ))}
            {editable && !isDragging ? lastElement : <></>}
          </ReactGridLayout>
        </List>
        <Divider />
      </div>
    </Drawer>
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

export default connect(mapStateToProps, mapDispatchToProps)(NeoPageListDrawer);
