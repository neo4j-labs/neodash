import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getPages } from '../DashboardSelectors';
import debounce from 'lodash/debounce';
import { addPageThunk, movePageThunk } from '../DashboardThunks';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { setPageNumberThunk } from '../../settings/SettingsThunks';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { applicationIsStandalone } from '../../application/ApplicationSelectors';
import { Tabs, IconButton } from '@neo4j-ndl/react';
import { PlusIconOutline } from '@neo4j-ndl/react/icons';
import DashboardHeaderPageTitle from './DashboardHeaderPageTitleNew';
import { useSensor, useSensors } from '@dnd-kit/core';
import { horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KeyboardSensor, MouseSensor } from '../../utils/accessibility';
import Droppable from '../../component/misc/NeoDroppableZone';
import { SortableListNoContext } from '../../component/misc/NeoSortableListNoContext';

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
  const addIndex = (e: any[]) => {
    return e.map((e, i) => {
      return { ...e, id: `DashboardHeaderPageTitle_${i}`, editing: false };
    });
  };

  const [canSwitchPages, setCanSwitchPages] = React.useState(true);
  const [pagesIndexed, setPagesIndexed] = React.useState(addIndex(pages));

  // We debounce several state changes to improve user experience.
  const debouncedSetCanSwitchPages = useCallback(debounce(setCanSwitchPages, 50), []);

  const pageAddButton = (
    <IconButton aria-label={'add page'} className='n-relative -n-top-1' size='large' onClick={addPage} clean>
      <PlusIconOutline />
    </IconButton>
  );

  function handleTabsChange(items: any[], activeIndex: number, overIndex: number) {
    console.log('handleTabsChange');
    console.log(items);
    console.log(activeIndex);
    console.log(overIndex);
    if (activeIndex !== overIndex && overIndex !== -1) {
      // old - new
      movePage(activeIndex, overIndex);
      setPagesIndexed(addIndex(items));
      debouncedSetCanSwitchPages(true);
    }
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Enable sort function when dragging 10px
    },
  });

  const keySensor = useSensor(KeyboardSensor, {
    keyboardCodes: {
      start: ['Space'],
      cancel: ['Escape'],
      end: ['Space'],
    },
  });

  const sensors = useSensors(mouseSensor, keySensor);

  useEffect(() => {
    setPagesIndexed(addIndex(pages));
  }, [JSON.stringify(pages)]);

  const setEditing = (id, value) => {
    let copy = [...pagesIndexed];
    copy[id].editing = value;
    setPagesIndexed(copy);
  };
  const content = (
    <div className='n-flex n-flex-row n-w-full'>
      <Tabs fill='underline' onChange={(tabId) => (canSwitchPages ? selectPage(tabId) : null)} value={pagenumber}>
        <SortableListNoContext
          items={pagesIndexed}
          onChange={handleTabsChange}
          renderItem={(item, index) => (
            <Droppable id={`DashboardHeaderPageTitleDroppable_${index}`}>
              <SortableListNoContext.Item
                id={`DashboardHeaderPageTitle_${index}`}
                render={<div>item.title</div>}
                onDraggingOrSorting={() => setEditing(index, false)}
              >
                <DashboardHeaderPageTitle
                  title={item.title}
                  tabIndex={index}
                  key={`DashboardHeaderPageTitle_${index}`}
                  disabled={!editable}
                  editing={item.editing}
                  setEditing={setEditing}
                />
              </SortableListNoContext.Item>
            </Droppable>
          )}
          strategy={horizontalListSortingStrategy}
        />
      </Tabs>
      {editable && pageAddButton}
    </div>
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
