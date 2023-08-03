import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getPages } from '../DashboardSelectors';
import debounce from 'lodash/debounce';
import { addPageThunk, movePageThunk } from '../DashboardThunks';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { setPageNumberThunk } from '../../settings/SettingsThunks';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import RGL, { WidthProvider } from 'react-grid-layout';
import { DASHBOARD_PAGE_LIST_COLOR, DASHBOARD_PAGE_LIST_ACTIVE_COLOR } from '../../config/ApplicationConfig';
import { Tabs, IconButton } from '@neo4j-ndl/react';
import { PlusIconOutline } from '@neo4j-ndl/react/icons';
import DashboardHeaderPageTitle from './DashboardHeaderPageTitle';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
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
  movePage,
  selectPage,
}) => {
  const [layout, setLayout] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [canSwitchPages, setCanSwitchPages] = React.useState(true);

  // We debounce several state changes to improve user experience.
  const debouncedSetCanSwitchPages = useCallback(debounce(setCanSwitchPages, 50), []);

  const pageAddButton = (
    <IconButton className='n-relative -n-top-1' size='large' onClick={addPage} clean>
      <PlusIconOutline />
    </IconButton>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('_')[1]);
      const newIndex = parseInt(over.id.split('_')[1]);
      movePage(oldIndex, newIndex);
    }
  }

  const content = (
    <div className='n-flex n-flex-row n-w-full'>
      <Tabs fill='underline' onChange={(tabId) => (canSwitchPages ? selectPage(tabId) : null)} value={pagenumber}>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
            {pages.map((page, i) => (
              <DashboardHeaderPageTitle title={page.title} tabIndex={i} key={i} disabled={!editable} />
            ))}
          </SortableContext>
        </DndContext>
      </Tabs>
      {editable && !isDragging ? pageAddButton : <></>}
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
  addPage: () => {
    dispatch(addPageThunk());
  },
  movePage: (oldIndex: number, newIndex: number) => {
    dispatch(movePageThunk(oldIndex, newIndex));
  },
  onConnectionModalOpen: () => {
    dispatch(setConnectionModalOpen(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderPageList);
