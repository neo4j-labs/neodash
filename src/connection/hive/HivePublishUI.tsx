import React from 'react';
import { Button } from '@neo4j-ndl/react';
import SaveToHiveModal from '../../extensions/hive/components/SaveToHiveModal';
import { CloudArrowUpIconOutline } from '@neo4j-ndl/react/icons';

export function getHivePublishUIButton(_params: any): any {
  const { onClick } = _params;

  return (
    <Button fill='outlined' color='neutral' floating onClick={onClick} style={{ marginLeft: '10px' }}>
      Publish to Hive
      <CloudArrowUpIconOutline className='btn-icon-base-r' aria-label={'publish to cloud'} />
    </Button>
  );
}

export function getHivePublishUIDialog(_params: any): any {
  const { parentClose, publishUIDialogOpen, closePublishUIDialog } = _params;

  return (
    <SaveToHiveModal
      cachedDashboard={_params.cachedDashboard}
      modalOpen={publishUIDialogOpen}
      closeDialog={(options) => {
        options = options || {};
        closePublishUIDialog();
        if (options.closeSaveDialog && parentClose) {
          parentClose();
        }
      }}
    />
  );
}
