import React, { useMemo, useState } from 'react';
import NeoPage from '../page/Page';
import NeoDashboardHeader from './header/DashboardHeader';
import NeoDashboardTitle from './header/DashboardTitle';
import NeoDashboardHeaderPageList from './header/DashboardHeaderPageList';
import { createDriver, Neo4jProvider } from 'use-neo4j';
import { applicationGetConnection, applicationGetStandaloneSettings } from '../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NeoDashboardConnectionUpdateHandler from '../component/misc/DashboardConnectionUpdateHandler';
import { forceRefreshPage } from '../page/PageActions';
import { getPageNumber } from '../settings/SettingsSelectors';
import { createNotificationThunk } from '../page/PageThunks';
import { version } from '../modal/AboutModal';
import {
  Active,
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KeyboardSensor, MouseSensor } from '../utils/accessibility';
import { createPortal } from 'react-dom';
import { DroppableOverlay } from '../component/misc/NeoDroppableOverlay';
import { collisionDetectionStrategy } from '../component/misc/CollisionStrategy';
import { moveCardThunk, movePageThunk } from './DashboardThunks';
import { ArrowDownOnSquareStackIconSolid, HandRaisedIconSolid } from '@neo4j-ndl/react/icons';
import { IconButton } from '@neo4j-ndl/react';

const Dashboard = ({
  pagenumber,
  connection,
  applicationSettings,
  onConnectionUpdate,
  onDownloadDashboardAsImage,
  onAboutModalOpen,
  resetApplication,
  movePage,
  moveCard,
}) => {
  const [driver, setDriver] = React.useState(undefined);
  const [active, setActive] = useState<Active | null>(null);
  // const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);

  // If no driver is yet instantiated, create a new one.
  if (driver == undefined) {
    const newDriver = createDriver(
      connection.protocol,
      connection.url,
      connection.port,
      connection.username,
      connection.password,
      { userAgent: `neodash/v${version}` }
    );
    setDriver(newDriver);
  }
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) {
      setActive(null);
      return;
    }

    if (over && active.id !== over?.id) {
      if (active.id?.startsWith('DashboardHeaderPageTitle_') && over.id?.startsWith('DashboardHeaderPageTitle_')) {
        const oldIndex = parseInt(active.id.split('_')[1]);
        const newIndex = parseInt(over.id.split('_')[1]);

        if (newIndex !== -1) {
          // old - new
          movePage(oldIndex, newIndex);
          // setPagesIndexed(addIndex(items));
        }
      } else if (active.id?.startsWith('Card_') && over.id?.startsWith('DashboardHeaderPageTitleDroppable_')) {
        const cardId = active.id.split('_')[1];
        const pageNumber = parseInt(over.id.split('_')[1]);
        moveCard(cardId, pageNumber);
      }

      /**/
    }

    setActive(null);
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

  const renderItem = (active) => {
    if (active?.id?.startsWith('DashboardHeaderPageTitle_')) {
      return (
        <div>
          <HandRaisedIconSolid className='btn-icon-sm-l' />
        </div>
      );
    }
    return (
      <div>
        <ArrowDownOnSquareStackIconSolid className='btn-icon-sm-l' />
      </div>
    );
  };

  const content = (
    <Neo4jProvider driver={driver}>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        onDragCancel={() => {
          setActive(null);
        }}
        onDragStart={({ active }) => {
          if (active.id?.startsWith('DashboardHeaderPageTitle_')) {
            setActive(active);
          }
        }}
        onDragOver={({ active, over }) => {
          if (active.id?.startsWith('Card_')) {
            if (over?.id?.startsWith('DashboardHeaderPageTitleDroppable_')) {
              setActive(active);
            } else {
              setActive(null);
            }
          }
        }}
        collisionDetection={rectIntersection}
      >
        <NeoDashboardConnectionUpdateHandler
          pagenumber={pagenumber}
          connection={connection}
          onConnectionUpdate={onConnectionUpdate}
        />
        {/* Navigation Bar */}
        <div className='n-w-screen n-flex n-flex-row n-items-center n-bg-neutral-bg-weak n-border-b n-border-neutral-border-weak'>
          <NeoDashboardHeader
            connection={connection}
            onDownloadImage={onDownloadDashboardAsImage}
            onAboutModalOpen={onAboutModalOpen}
            resetApplication={resetApplication}
          ></NeoDashboardHeader>
        </div>
        {/* Main Page */}
        <div className='n-w-full n-h-full n-overflow-y-scroll n-flex n-flex-row'>
          {/* Main Content */}
          <main className='n-flex-1 n-relative n-z-0 n-scroll-smooth n-w-full'>
            <div className='n-absolute n-inset-0 page-spacing'>
              <div className='page-spacing-overflow'>
                {/* The main content of the page */}
                {applicationSettings.standalonePassword ? (
                  <div style={{ textAlign: 'center', color: 'red', paddingTop: 60, marginBottom: -50 }}>
                    Warning: NeoDash is running with a plaintext password in config.json.
                  </div>
                ) : (
                  <></>
                )}
                <NeoDashboardTitle />
                <NeoDashboardHeaderPageList />
                <NeoPage></NeoPage>
                {createPortal(
                  <DroppableOverlay>{active !== undefined ? renderItem(active) : null}</DroppableOverlay>,
                  document.body
                )}
              </div>
            </div>
          </main>
        </div>
      </DndContext>
    </Neo4jProvider>
  );
  return content;
};

const mapStateToProps = (state) => ({
  connection: applicationGetConnection(state),
  pagenumber: getPageNumber(state),
  applicationSettings: applicationGetStandaloneSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  onConnectionUpdate: (pagenumber) => {
    dispatch(
      createNotificationThunk(
        'Connection Updated',
        'You have updated your Neo4j connection, your reports have been reloaded.'
      )
    );
    dispatch(forceRefreshPage(pagenumber));
  },
  movePage: (oldIndex: number, newIndex: number) => {
    dispatch(movePageThunk(oldIndex, newIndex));
  },
  moveCard: (cardId: number, pageNumber: number) => {
    dispatch(moveCardThunk(cardId, pageNumber));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
