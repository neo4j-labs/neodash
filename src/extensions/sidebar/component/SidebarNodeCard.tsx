import React from 'react';
import Card from '@material-ui/core/Card';
import SidebarNodeInspectionModal from './SidebarNodeInspectionModal';
import { CardContent } from '@material-ui/core';
import { recordToNative } from '../../../chart/ChartUtils';
import { renderValueByType } from '../../../report/ReportRecordProcessing';

// TODO: Understand what to show (probably an option (maybe first three fields by default))
export const SidebarNodeCard = ({ entity, extensionSettings }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  // TODO: understand how to bind colors
  const colorProperty = extensionSettings.colorProperty ? extensionSettings.colorProperty : 'color';
  const titleProperty = extensionSettings.titleProperty ? extensionSettings.titleProperty : 'title';
  const bodyProperty = extensionSettings.bodyProperty ? extensionSettings.bodyProperty : 'body';

  const content = (
    <>
      <Card
        style={{
          height: '120px',
          width: '200px',
          cursor: 'pointer',
          backgroundColor: entity.properties[colorProperty],
        }}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <CardContent>
          <h3 style={{ margin: 0 }}>
            {entity.properties && entity.properties[titleProperty]
              ? renderValueByType(entity.properties[titleProperty])
              : '(no title)'}{' '}
          </h3>
          <p style={{ margin: 0 }}>
            {entity.properties && entity.properties[bodyProperty]
              ? renderValueByType(entity.properties[bodyProperty])
              : '(no value)'}{' '}
          </p>
        </CardContent>
      </Card>
      <SidebarNodeInspectionModal
        entity={entity}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></SidebarNodeInspectionModal>
    </>
  );
  return content;
};

export default SidebarNodeCard;
