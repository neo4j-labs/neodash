import React from 'react';
import { IconButton } from '@neo4j-ndl/react';
import { ShareIconOutline, ShareIconSolid, DocumentDuplicateIconOutline, EllipsisHorizontalIconOutline  } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { Snackbar, Alert } from '@mui/material';
import { connect, useSelector } from 'react-redux';
import { getPages } from '../DashboardSelectors';
import { getGlobalParameters, getPageNumber } from '../../settings/SettingsSelectors';
import classnames from 'classnames';


interface ShareDashboardURLProps { exportPageParameters, pageNumber? }
export const ShareDashboardURL:React.FC<ShareDashboardURLProps> = ({ exportPageParameters = false, pageNumber }) => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  if(pageNumber == undefined){
    pageNumber = useSelector((state) => getPageNumber(state));
  }
  const pages = useSelector((state) => getPages(state));
  const parameters = useSelector((state) => getGlobalParameters(state));

  const TIMEOUT_DURATION = 2000;
  const currentUrl = window.location.href;
  const handleClickShare = async () => {
    try {
      const url: URL = buildURL(getPath(currentUrl), extractQueryParams(pages, pageNumber, parameters, exportPageParameters));
      await navigator.clipboard.writeText(url.toString());
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    }
  };

return (
  <>
    <Tooltip title={exportPageParameters? "Share page": "Share dashboard"} aria-label="Share dashboard URL" disableInteractive>
      <IconButton
        onClick={(e) => {
          if (exportPageParameters) {
            e.stopPropagation();
          }
          handleClickShare();
        }}
        aria-label={exportPageParameters ? "Share page link" : "Share dashboard link"}
        className={exportPageParameters ? "n-relative n-top-1 visible-on-tab-hover" : undefined}
        style={{
          ...(exportPageParameters ? { height: "1.1rem", marginLeft: "0.25rem" } : { marginLeft: "0.5rem", marginRight: "0.5rem"}),
        }}
        size={exportPageParameters ? "small" : undefined}
        clean={exportPageParameters ? true : undefined}
      >
        <ShareIconSolid />
      </IconButton>
    </Tooltip>

    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isSuccess}
      autoHideDuration={TIMEOUT_DURATION}
      onClose={() => setIsSuccess(false)}
    >
      <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
        {exportPageParameters? "Page link copied!" :"Dashboard link copied!"}
      </Alert>
    </Snackbar>
  </>
);

};

function buildURL(baseUrlWithPath: string, queryParams: string): URL {
  const shareableURL = new URL(baseUrlWithPath);
  shareableURL.search = queryParams;
  return shareableURL;
}

function extractQueryParams(pages, pageNumber = 0, parameters, exportPageParameters: boolean): string {
  if (!parameters) {
    return '';
  }
  const map = new Map(Object.entries(parameters));
  return encodeIntoURIParams(map, pageNumber, pages, exportPageParameters);
}

function getPath(currentUrl: string): string {
  const parsedURL = new URL(currentUrl, window.location.origin);
  return parsedURL.origin + parsedURL.pathname;
}

function filterParams(key: string, val: string): boolean {
  return key.startsWith('neodash_') && !key.endsWith('_display') && val != null;
}

function extractParametersFromReports(reports: any[]): Set<string> {
  const paramSet = new Set<string>();

  for (const report of reports) {
    const { settings } = report;
    if (!settings) {
        continue;
    }
    if (settings.parameterName) {
      paramSet.add(settings.parameterName);
    }

    if (Array.isArray(settings.formFields)) {
      settings.formFields.forEach(formField => {
        if (formField && formField?.settings?.parameterName != null && formField?.settings?.parameterName.length > 0) {
          paramSet.add(formField?.settings?.parameterName);
        }
      });
    }
  }
  return paramSet;
}

function filterMapByReports(inputMap: Map<string, string>, paramSet: (Set<string> | null)): Map<string, string> {
  if(paramSet == null){
    return new Map();
  }
    const filteredMap = new Map<string, string>();

  for (const [key, val] of inputMap) {
    if (paramSet.has(key)) {
      filteredMap.set(key, String(val));  
    }
  }

  return filteredMap;
}

const encodeIntoURIParams = (map: Map<string, any>, pageNumber: number, pages: any, exportPageParameters: boolean): string => {
  const filteredParams: Map<string, string> = new Map(
    [...map].filter(([key, val]) => filterParams(key, String(val)))
  );
  
  const paramSet = exportPageParameters ? extractParametersFromReports(pages[pageNumber]?.reports) : null;
  const filteredMap = exportPageParameters ? filterMapByReports(filteredParams, paramSet): filteredParams;
  const urlParams = new URLSearchParams();


  [...filteredMap.entries()]
    .map(([key, val]) => {
      const cleanStr = JSON.stringify(val).replace(/^"|"$/g, ''); 
      urlParams.set(key, cleanStr);
    });

  urlParams.set('page', String(pageNumber));

  return urlParams.toString();
};