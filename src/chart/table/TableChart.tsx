import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ChartProps } from '../Chart';
import {
  evaluateRulesOnDict,
  generateClassDefinitionsBasedOnRules,
  useStyleRules,
} from '../../extensions/styling/StyleRuleEvaluator';
import { IconButton, Tooltip } from '@material-ui/core';
import { downloadCSV } from '../ChartUtils';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { getRendererForValue, rendererForType, RenderSubValue } from '../../report/ReportRecordProcessing';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import Button from '@material-ui/core/Button';

const TABLE_HEADER_HEIGHT = 32;
const TABLE_FOOTER_HEIGHT = 52;
const TABLE_ROW_HEIGHT = 52;
const HIDDEN_COLUMN_PREFIX = '__';

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

function ApplyColumnType(column, value) {
  const renderer = getRendererForValue(value);
  const renderCell = renderer.renderValue;
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

const NeoTableChart = (props: ChartProps) => {
  const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;
  const allowDownload =
    props.settings && props.settings.allowDownload !== undefined ? props.settings.allowDownload : false;

  const actionsRules = [];
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

  let columnWidths = null;
  try {
    columnWidths = props.settings && props.settings.columnWidths && JSON.parse(props.settings.columnWidths);
  } catch (e) {
    // do nothing
  } finally {
    // do nothing
  }

  const { records } = props;

  const actionableFields = [];

  const columns = transposed
    ? ['Field'].concat(records.map((r, j) => `Value${j == 0 ? '' : ` ${(j + 1).toString()}`}`)).map((key, i) => {
        const value = key;
        return ApplyColumnType(
          {
            field: generateSafeColumnKey(key),
            headerName: generateSafeColumnKey(key),
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: columnWidths && i < columnWidths.length ? columnWidths[i] : 1,
            disableClickEventBubbling: true,
          },
          value
        );
      })
    : records[0].keys.map((key, i) => {
        const value = records[0].get(key);
        return ApplyColumnType(
          {
            field: generateSafeColumnKey(key),
            headerName: generateSafeColumnKey(key),
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: columnWidths && i < columnWidths.length ? columnWidths[i] : 1,
            disableClickEventBubbling: true,
          },
          value
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

  return (
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
              <CloseIcon fontSize='small' />
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
            style={{ bottom: '9px', left: '3px', position: 'absolute' }}
          >
            <SaveAltIcon style={{ fontSize: '1.3rem', zIndex: 5 }} fontSize='small'></SaveAltIcon>
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
      <DataGrid
        headerHeight={32}
        rowHeight={tableRowHeight}
        rows={rows}
        columns={columns}
        columnVisibilityModel={hiddenColumns}
        onCellClick={() => false}
        onCellDoubleClick={(e) => {
          setNotificationOpen(true);
          navigator.clipboard.writeText(e.value);
        }}
        pageSize={tablePageSize}
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
  );
};

export default NeoTableChart;
