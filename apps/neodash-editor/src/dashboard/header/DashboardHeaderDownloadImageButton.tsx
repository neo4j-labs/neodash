import React from 'react';
import { IconButton } from '@neo4j-ndl/react';
import { Tooltip } from '@mui/material';
import { CameraIconSolid } from '@neo4j-ndl/react/icons';

import { DASHBOARD_HEADER_BUTTON_COLOR } from '../../config/ApplicationConfig';
import StyleConfig from '../../config/StyleConfig';

await StyleConfig.getInstance();

export const NeoDashboardHeaderDownloadImageButton = (onDownloadImage) => {
  const content = (
    <Tooltip title={'Download Dashboard as Image'} disableInteractive>
      <IconButton
        aria-label={'camera'}
        style={DASHBOARD_HEADER_BUTTON_COLOR ? { color: DASHBOARD_HEADER_BUTTON_COLOR } : {}}
        onClick={() => onDownloadImage()}
        size='large'
        clean
      >
        <CameraIconSolid aria-label={'camera icon'} />
      </IconButton>
    </Tooltip>
  );

  return content;
};

export default NeoDashboardHeaderDownloadImageButton;
