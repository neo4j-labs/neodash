import React from 'react';
import { IconButton } from '@neo4j-ndl/react';
import { ShareIconSolid } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { getPages } from '../../dashboard/DashboardSelectors';
import { getGlobalParameters, getPageNumber } from '../../settings/SettingsSelectors';
import { buildURL, extractQueryParams, getPath } from '../../utils/shareUtils';

interface ShareableButtonProps {
  exportPageParameters: boolean;
  pageNumber?: number;
}
export const ShareableButton: React.FC<ShareableButtonProps> = ({ exportPageParameters = false, pageNumber }) => {
  const TIMEOUT_DURATION = 2000;
  const currentUrl = window.location.href;
  const [isSuccess, setIsSuccess] = React.useState(false);
  const pages = useSelector((state) => getPages(state));
  const parameters = useSelector((state) => getGlobalParameters(state));
  if (pageNumber == undefined) {
    pageNumber = useSelector((state) => getPageNumber(state));
  }

  const handleClickShare = async () => {
    try {
      const url: URL = buildURL(
        getPath(currentUrl),
        extractQueryParams(pages, pageNumber, parameters, exportPageParameters)
      );
      await navigator.clipboard.writeText(url.toString());
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    }
  };

  return (
    <>
      <Tooltip
        title={exportPageParameters ? 'Share page' : 'Share dashboard'}
        aria-label='Share dashboard URL'
        disableInteractive
      >
        <IconButton
          onClick={(e) => {
            if (exportPageParameters) {
              e.stopPropagation();
            }
            handleClickShare();
          }}
          aria-label={exportPageParameters ? 'Share page link' : 'Share dashboard link'}
          className={exportPageParameters ? 'n-relative n-top-1 visible-on-tab-hover' : undefined}
          style={{
            ...(exportPageParameters
              ? { height: '1.1rem', marginLeft: '0.25rem' }
              : { marginLeft: '0.5rem', marginRight: '0.5rem' }),
          }}
          size={exportPageParameters ? 'small' : undefined}
          clean={exportPageParameters ? true : undefined}
        >
          <ShareIconSolid />
        </IconButton>
      </Tooltip>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSuccess}
        autoHideDuration={TIMEOUT_DURATION}
        onClose={() => setIsSuccess(false)}
      >
        <Alert severity='success' variant='filled' sx={{ width: '100%' }}>
          {exportPageParameters ? 'Page link copied!' : 'Dashboard link copied!'}
        </Alert>
      </Snackbar>
    </>
  );
};
