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
import { Tabs, IconButton } from '@neo4j-ndl/react';
import { PlusIconOutline } from '@neo4j-ndl/react/icons';
import DashboardHeaderPageTitle from './DashboardHeaderPageTitle';
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KeyboardSensor, MouseSensor } from '../../utils/accessibility';

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
  const [canSwitchPages, setCanSwitchPages] = React.useState(true);

  // We debounce several state changes to improve user experience.
  const debouncedSetCanSwitchPages = useCallback(debounce(setCanSwitchPages, 50), []);

  const pageAddButton = (
    <IconButton aria-label={'add page'} className='n-relative -n-top-1' size='large' onClick={addPage} clean>
      <PlusIconOutline />
    </IconButton>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || !editable) {
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('_')[1]);
      const newIndex = parseInt(over.id.split('_')[1]);
      movePage(oldIndex, newIndex);
    }

    debouncedSetCanSwitchPages(true);
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

  const content = (
    <div className='n-flex n-flex-row n-w-full'>
      <Tabs fill='underline' onChange={(tabId) => (canSwitchPages ? selectPage(tabId) : null)} value={pagenumber}>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
            {pages.map((page, i) => (
              <DashboardHeaderPageTitle
                title={page.title}
                tabIndex={i}
                key={`DashboardHeaderPageTitle_${i}`}
                disabled={!editable}
              />
            ))}
          </SortableContext>
        </DndContext>
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
