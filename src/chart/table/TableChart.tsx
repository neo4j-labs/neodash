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

const TABLE_HEADER_HEIGHT = 32;
const TABLE_FOOTER_HEIGHT = 62;
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
    props.settings.styleRules,
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
    ? [records[0].keys[0]].concat(records.map((record) => record._fields[0]?.toString() || '')).map((key, i) => {
        const uniqueKey = `${String(key)}_${i}`;
        return ApplyColumnType(
          {
            key: `col-key-${i}`,
            field: generateSafeColumnKey(uniqueKey),
            headerName: generateSafeColumnKey(key),
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: columnWidths && i < columnWidths.length ? columnWidths[i] : 1,
            disableClickEventBubbling: true,
          },
          key,
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

  const getTransposedRows = (records) => {
    // Skip first key
    const rowKeys = [...records[0].keys];
    rowKeys.shift();

    // Add values in rows
    const rowsWithValues = rowKeys.map((key, i) =>
      Object.assign(
        { id: i, Field: key },
        ...records.map((record, j) => ({
          [`${record._fields[0]}_${j + 1}`]: RenderSubValue(record._fields[i + 1]),
        }))
      )
    );

    // Add field in rows
    const rowsWithFieldAndValues = rowsWithValues.map((row, i) => ({
      ...row,
      [`${records[0].keys[0]}_${0}`]: rowKeys[i],
    }));

    return rowsWithFieldAndValues;
  };

  const rows = transposed
    ? getTransposedRows(records)
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
          <Tooltip title='Download CSV' aria-label='' disableInteractive>
            <IconButton
              onClick={() => {
                downloadCSV(rows);
              }}
              aria-label='download csv'
              className='n-absolute n-z-10 n-bottom-4 n-left-1'
              clean
            >
              <CloudArrowDownIconOutline />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}

        <DataGrid
          key={'tableKey'}
          headerHeight={32}
          rowHeight={tableRowHeight}
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
          rowsPerPageOptions={rows.length < 5 ? [rows.length, 5] : [5]}
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
