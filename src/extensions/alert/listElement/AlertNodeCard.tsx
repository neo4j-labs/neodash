import React from 'react';
import Card from '@material-ui/core/Card';
import AlertNodeInspectionModal from './AlertNodeInspectionModal';
import { CardContent } from '@material-ui/core';
/**
 *
 * "colorProperty": "cazzo",
 *      "titleProperty": "ciao",
 *      "bodyProperty": "apdmapwdpoawjdpjwapdjpwajdp",
 *      "refreshButtonEnabled": true
 * @returns
 */
// TODO: Understand what to show (probably an option (maybe first three fields by default))
export const AlertNodeCard = ({ record, extensionSettings }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  // TODO: understand how to bind colors
  const colorProperty = extensionSettings.colorProperty ? extensionSettings.colorProperty : 'color';
  const titleProperty = extensionSettings.titleProperty ? extensionSettings.titleProperty : 'title';
  const bodyProperty = extensionSettings.bodyProperty ? extensionSettings.bodyProperty : 'body';
  console.log(titleProperty);
  const content = (
    <>
      <Card
        style={{ height: '120px', width: '200px', cursor: 'pointer' }}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <h1>
          {' '}
          {record.properties && record.properties[titleProperty]
            ? record.properties[titleProperty]
            : 'unknown title'}{' '}
        </h1>
        <h3>
          {' '}
          {record.properties && record.properties[bodyProperty] ? record.properties[bodyProperty] : 'unknown body'}{' '}
        </h3>
      </Card>
      <AlertNodeInspectionModal
        record={record}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></AlertNodeInspectionModal>
    </>
  );
  return content;
};

export default AlertNodeCard;
