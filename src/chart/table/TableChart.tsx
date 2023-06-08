import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ChartProps } from '../Chart';
import {
  evaluateRulesOnDict,
  generateClassDefinitionsBasedOnRules,
  useStyleRules,
} from '../../extensions/styling/StyleRuleEvaluator';
import { Tooltip, Snackbar } from '@mui/material';
import { downloadCSV } from '../ChartUtils';
import { getRendererForValue, rendererForType, RenderSubValue } from '../../report/ReportRecordProcessing';

import { Close } from '@mui/icons-material';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import {
  getRule,
  executeActionRule,
  getPageNumbersAndNamesList,
  performActionOnElement,
} from '../../extensions/advancedcharts/Utils';

import { IconButton } from '@neo4j-ndl/react';
import { CloudArrowDownIconOutline } from '@neo4j-ndl/react/icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { renderCellExpand } from '../../component/misc/DataGridExpandedRenderer';

const TABLE_HEADER_HEIGHT = 32;
const TABLE_FOOTER_HEIGHT = 52;
const TABLE_ROW_HEIGHT = 52;
const HIDDEN_COLUMN_PREFIX = '__';

const theme = createTheme({
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
  },
});
const fallbackRenderer = (value) => {
  return JSON.stringify(value);
};

function renderAsButtonWrapper(renderer) {
  return function renderAsButton(value) {
    return (
      <Button
        style={{ width: '100%', marginLeft: '5px', marginRight: '5px' }}
        variant='contained'
        color='primary'
      >{`${renderer(value)}`}</Button>
    );
  };
}

function ApplyColumnType(column, value, asAction) {
  const renderer = getRendererForValue(value);
  const renderCell = asAction ? renderAsButtonWrapper(renderer.renderValue) : renderer.renderValue;
  const columnProperties = renderer
    ? { type: renderer.type, renderCell: renderCell ? renderCell : fallbackRenderer }
    : rendererForType.string;
  if (columnProperties) {
    column = { ...column, ...columnProperties };
  }
  column.renderCell = (obj) => renderCellExpand(obj);
  return column;
}

export const generateSafeColumnKey = (key) => {
  return key != 'id' ? key : `${key} `;
};

export const NeoTableChart = (props: ChartProps) => {
  const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;
  const allowDownload =
    props.settings && props.settings.allowDownload !== undefined ? props.settings.allowDownload : false;

  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];
  const compact = props.settings && props.settings.compact !== undefined ? props.settings.compact : false;
  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    props.settings?.styleRules,
    props.getGlobalParameter
  );

  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const useStyles = generateClassDefinitionsBasedOnRules(styleRules);
  const classes = useStyles();
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

  const tableRowHeight = compact ? TABLE_ROW_HEIGHT / 2 : TABLE_ROW_HEIGHT;
  const pageSizeReducer = compact ? 3 : 1;

  const columnWidthsType =
    props.settings && props.settings.columnWidthsType ? props.settings.columnWidthsType : 'Relative (%)';
  let columnWidths = null;
  try {
    columnWidths = props.settings && props.settings.columnWidths && JSON.parse(props.settings.columnWidths);
  } catch (e) {
    // do nothing
  } finally {
    // do nothing
  }

  const { records } = props;

  const generateSafeColumnKey = (key) => {
    return key != 'id' ? key : `${key} `;
  };

  const actionableFields = actionsRules.map((r) => r.field);

  const columns = transposed
    ? ['Field'].concat(records.map((r, j) => `Value${j == 0 ? '' : ` ${(j + 1).toString()}`}`)).map((key, i) => {
        const value = key;
        return ApplyColumnType(
          {
            key: `col-key-${i}`,
            field: generateSafeColumnKey(key),
            headerName: generateSafeColumnKey(key),
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: columnWidths && i < columnWidths.length ? columnWidths[i] : 1,
            disableClickEventBubbling: true,
          },
          value,
          actionableFields.includes(key)
        );
      })
    : records[0].keys.map((key, i) => {
        const value = records[0].get(key);
        if (columnWidthsType == 'Relative (%)') {
          return ApplyColumnType(
            {
              key: `col-key-${i}`,
              field: generateSafeColumnKey(key),
              headerName: generateSafeColumnKey(key),
              headerClassName: 'table-small-header',
              disableColumnSelector: true,
              flex: columnWidths && i < columnWidths.length ? columnWidths[i] : 1,
              disableClickEventBubbling: true,
            },
            value,
            actionableFields.includes(key)
          );
        }
        return ApplyColumnType(
          {
            key: `col-key-${i}`,
            field: generateSafeColumnKey(key),
            headerName: generateSafeColumnKey(key),
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            width: columnWidths && i < columnWidths.length ? columnWidths[i] : 100,
            disableClickEventBubbling: true,
          },
          value,
          actionableFields.includes(key)
        );
      });
  const hiddenColumns = Object.assign(
    {},
    ...columns.filter((x) => x.field.startsWith(HIDDEN_COLUMN_PREFIX)).map((x) => ({ [x.field]: false }))
  );

  const rows = transposed
    ? records[0].keys.map((key, i) => {
        return Object.assign(
          { id: i, Field: key },
          ...records.map((r, j) => ({
            [`Value${j == 0 ? '' : ` ${(j + 1).toString()}`}`]: RenderSubValue(r._fields[i]),
          }))
        );
      })
    : records.map((record, rownumber) => {
        return Object.assign(
          { id: rownumber },
          ...record._fields.map((field, i) => ({ [generateSafeColumnKey(record.keys[i])]: field }))
        );
      });

  const availableRowHeight = (props.dimensions.height - TABLE_HEADER_HEIGHT - TABLE_FOOTER_HEIGHT) / tableRowHeight;
  const tablePageSize = compact
    ? Math.round(availableRowHeight) - pageSizeReducer
    : Math.floor(availableRowHeight) - pageSizeReducer;

  const pageNames = getPageNumbersAndNamesList();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} style={{ height: '100%', width: '100%', position: 'relative' }}>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={notificationOpen}
          autoHideDuration={2000}
          onClose={() => setNotificationOpen(false)}
          message='Value copied to clipboard.'
          action={
            <React.Fragment>
              <IconButton size='small' aria-label='close' color='inherit' onClick={() => setNotificationOpen(false)}>
                <Close fontSize='small' />
              </IconButton>
            </React.Fragment>
          }
        />

        {allowDownload && rows && rows.length > 0 ? (
          <Tooltip title='Download CSV' aria-label=''>
            <IconButton
              onClick={() => {
                downloadCSV(rows);
              }}
              aria-label='download csv'
              style={{ bottom: '9px', left: '3px', position: 'absolute', zIndex: 50 }}
              clean
            >
              <CloudArrowDownIconOutline />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}

        <DataGrid
          getRowHeight={() => 'auto'}
          key={'tableKey'}
          // autoHeight={true} // Only use autoheight if compact is not specified
          // rowHeight={compact ? tableRowHeight : undefined}
          // TODO: Bring this back in if it works. autoHeight is not ideal solution
          // sx={{
          //   '& .MuiDataGrid-viewport,.MuiDataGrid-row,.MuiDataGrid-renderingZone': {
          //     maxHeight: 'fit-content!important',
          //   },
          //   '& .MuiDataGrid-cell': {
          //     flexWrap: 'wrap',
          //     overflow: 'auto',
          //     whiteSpace: 'initial!important',
          //     display: 'flex!important',
          //     alignItems: 'top',
          //   },
          // }}
          headerHeight={32}
          rows={rows}
          columns={columns}
          columnVisibilityModel={hiddenColumns}
          onCellClick={(e) =>
            performActionOnElement(e, actionsRules, { ...props, pageNames: pageNames }, 'Click', 'Table')
          }
          onCellDoubleClick={(e) => {
            let rules = getRule(e, actionsRules, 'doubleClick');
            if (rules !== null) {
              rules.forEach((rule) => executeActionRule(rule, e, { ...props, pageNames: pageNames }, 'table'));
            } else {
              setNotificationOpen(true);
              navigator.clipboard.writeText(e.value);
            }
          }}
          pageSize={tablePageSize > 0 ? tablePageSize : 5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          components={{
            ColumnSortedDescendingIcon: () => <></>,
            ColumnSortedAscendingIcon: () => <></>,
          }}
          getRowClassName={(params) => {
            return `rule${evaluateRulesOnDict(params.row, styleRules, ['row color', 'row text color'])}`;
          }}
          getCellClassName={(params) => {
            return `rule${evaluateRulesOnDict({ [params.field]: params.value }, styleRules, [
              'cell color',
              'cell text color',
            ])}`;
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default NeoTableChart;
