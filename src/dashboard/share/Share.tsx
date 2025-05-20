import React, { SyntheticEvent } from 'react';
import { IconButton } from '@neo4j-ndl/react';
import { ShareIconSolid } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';
import { store } from '../../index';

export const ShareDashboardURL = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const TIMEOUT_DURATION = 2000;
  const currentUrl = window.location.href;
  const handleClickShare = async () => {
    try {
      const url = buildURL(getPath(currentUrl), extractQueryParams(getPage()));
      await navigator.clipboard.writeText(url);
      setIsSuccess(true);
      console.log('Generated URL: ', url);
    } catch (error) {
      console.error(`Error occurred: ${error}`);
      setIsSuccess(false);
    }
  };

  return (
    <>
      <Tooltip title='Share dashboard' aria-label='settings' disableInteractive>
        <IconButton className='n-mx-1' onClick={handleClickShare} aria-label='Settings'>
          <ShareIconSolid />
        </IconButton>
      </Tooltip>
      {
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={isSuccess}
          autoHideDuration={TIMEOUT_DURATION}
          onClose={() => setIsSuccess(false)}
        >
          <Alert severity='success' variant='filled' sx={{ width: '100%' }}>
            Link copied!
          </Alert>
        </Snackbar>
      }
    </>
  );
};

function buildURL(baseUrlWithPath: string, queryParams: string): string {
  console.log('appendQueryParams', queryParams);
  console.log('Base URL ', baseUrlWithPath);
  const res = baseUrlWithPath + queryParams;
  console.log('Result', res);
  return res;
}

function extractQueryParams(pageNumber: number = 0): string {
  const objParams = store.getState()?.dashboard?.settings?.parameters || null;

  if (!objParams) {
    console.log('No params found');
    return '';
  }

  const map = new Map(Object.entries(objParams));

  //TODO: Handle case for only adding particular page params
  //TODO: Handle case when page is added in query params for app in standalone mode
  const filteredEntries = [...map]
    .filter(([key, val]) => key.startsWith('neodash_') && !key.endsWith('_display') && val != null && val != undefined)
    .map(([key, val]) => {
      const str: string = JSON.stringify(val);
      const cleanStr: string = typeof str === 'string' ? str.replace(/^"|"$/g, '') : str;
      console.log('cleanStr: ', cleanStr);
      return `${encodeURIComponent(key)}=${encodeURIComponent(cleanStr)}`;
    });
  filteredEntries.push(`${encodeURIComponent('page')}=${encodeURIComponent(pageNumber)}`);
  console.log('filteredEntries: ', filteredEntries);
  return filteredEntries.length ? `?${filteredEntries.join('&')}` : '';
}

function getPath(currentUrl: string): string {
  const parsedURL = new URL(currentUrl, window.location.origin);
  return parsedURL.origin + parsedURL.pathname;
}

function getPage(): number {
  return store.getState()?.dashboard.settings?.pagenumber || 0;
}
