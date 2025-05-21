import React from 'react';
import { IconButton } from '@neo4j-ndl/react';
import { ShareIconSolid } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { Snackbar, Alert } from '@mui/material';
import { connect } from 'react-redux';
import { getPages } from '../DashboardSelectors';
import { getGlobalParameters, getPageNumber } from '../../settings/SettingsSelectors';

export const ShareDashboardURL = ({ pages, pageNumber, parameters }) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const TIMEOUT_DURATION = 2000;
  const currentUrl = window.location.href;
  const handleClickShare = async () => {
    try {
      const url = buildURL(getPath(currentUrl), extractQueryParams(pages, pageNumber, parameters));
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
    </>
  );
};

function buildURL(baseUrlWithPath: string, queryParams: string): string {
  return baseUrlWithPath + queryParams;
}

function extractQueryParams(pages, pageNumber = 0, parameters): string {
    console.log("reports: ", pages[pageNumber].reports);
  if (!parameters) {
    return '';
  }
  const map = new Map(Object.entries(parameters));

  //TODO: Handle case for only adding particular page params
  //TODO: Handle case when page is added in query params for app in standalone mode
  const filteredEntries = [...map]
    .filter(([key, val]) => filterParams(key, String(val), pageNumber, pages))
    .map(([key, val]) => {
      const cleanStr = JSON.stringify(val).replace(/^"|"$/g, '');
      return `${encodeURIComponent(key)}=${encodeURIComponent(cleanStr)}`;
    });
  filteredEntries.push(`${encodeURIComponent('page')}=${encodeURIComponent(pageNumber)}`);
  return filteredEntries.length ? `?${filteredEntries.join('&')}` : '';
}

function getPath(currentUrl: string): string {
  const parsedURL = new URL(currentUrl, window.location.origin);
  return parsedURL.origin + parsedURL.pathname;
}

function filterParams(key: string, val: string, pageNumber: number, pages): boolean {
  const filterValidKeyValue: boolean = key.startsWith('neodash_') && !key.endsWith('_display') && val != null;
  return filterValidKeyValue;
}

const mapStateToProps = (state) => ({
  pages: getPages(state),
  pageNumber: getPageNumber(state), 
  parameters: getGlobalParameters(state)
});

export default connect(mapStateToProps)(ShareDashboardURL);