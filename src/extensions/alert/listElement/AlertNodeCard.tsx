import React from 'react';
import Card from '@material-ui/core/Card';
import AlertNodeInspectionModal from './AlertNodeInspectionModal';

// TODO: Understand what to show (probably an option (maybe first three fields by default))
export const AlertNodeCard = ({ record }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const content = (
    <>
      <Card
        style={{ height: '120px', width: '200px', cursor: 'pointer' }}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <h1> {record.labels.join(',')} </h1>
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
