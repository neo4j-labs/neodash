import { Toolbar } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
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
const ReactGridLayout = WidthProvider(RGL);

/**
 * The component responsible for rendering the list of pages, as well as the logic for adding, removing, selecting and updating pages.
 */
export const NeoDashboardHeaderPageList = ({
  open,
  standalone,
  editable,
  pages,
  pagenumber,
  addPage,
  movePage,
  removePage,
  selectPage,
  setPageTitle,
}) => {
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
    setLayout([
      ...pages.map((page, index) => {
        return { x: index, y: 0, i: `${index}`, w: Math.min(2.0, 11.3 / pages.length), h: 1 };
      }),
      { x: pages.length, y: 0, i: `${timestamp}`, w: 0.0001, h: 1, isDraggable: false },
    ]);

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
    <Toolbar
      key={2}
      style={{ zIndex: 1001, minHeight: '50px', paddingLeft: '0px', paddingRight: '0px', background: 'white' }}
    >
      {!standalone ? (
        <div
          style={{
            width: open ? '0px' : '57px',
            zIndex: open ? 999 : 999,
            transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            height: '0px',
            background: 'white',
          }}
        ></div>
      ) : (
        <></>
      )}
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
          width: '100%',
          height: '47px',
          zIndex: -112,
          overflowY: 'hidden',
          overflowX: 'hidden',
          background: 'rgba(240,240,240)',
          padding: 0,
          margin: 0,
          boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
          borderBottom: '1px solid lightgrey',
        }}
        margin={[0, 0]}
        maxRows={1}
        rowHeight={47}
        isBounded={true}
        compactType={'horizontal'}
      >
        {pages.map((page, i) => (
          <div
            key={i}
            style={{
              background: 'grey',
              backgroundColor: pagenumber == i ? 'white' : 'inherit',
              display: 'inline-block',
              height: '100%',
              padding: 0,
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
        ))}
        {editable && !isDragging ? lastElement : <></>}
      </ReactGridLayout>
    </Toolbar>
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
