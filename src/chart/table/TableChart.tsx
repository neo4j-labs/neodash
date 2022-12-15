import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ChartProps } from '../Chart';
import { evaluateRulesOnDict, generateClassDefinitionsBasedOnRules } from '../../extensions/styling/StyleRuleEvaluator';
import { IconButton, Tooltip } from '@material-ui/core';
import { downloadCSV } from '../ChartUtils';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { getRendererForValue, rendererForType, RenderSubValue } from '../../report/ReportRecordProcessing';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import Button from '@material-ui/core/Button';
import { getRule } from '../../extensions/advancedcharts/Utils';

const TABLE_HEADER_HEIGHT = 32;
const TABLE_FOOTER_HEIGHT = 52;
const TABLE_ROW_HEIGHT = 52;
const HIDDEN_COLUMN_PREFIX = '__';

const fallbackRenderer = (value) => {
  return JSON.stringify(value);
};

function renderAsButton(value) {
  return (
    <Button
      style={{ width: '100%', marginLeft: '5px', marginRight: '5px' }}
      variant='contained'
      color='primary'
    >{`${value.formattedValue}`}</Button>
  );
}

function ApplyColumnType(column, value, asAction) {
  const renderer = getRendererForValue(value);
  const renderCell = asAction ? renderAsButton : renderer.renderValue;
  const columnProperties = renderer
    ? { type: renderer.type, renderCell: renderCell ? renderCell : fallbackRenderer }
    : rendererForType.string;
  if (columnProperties) {
    column = { ...column, ...columnProperties };
  }
  return column;
}

const NeoTableChart = (props: ChartProps) => {
  const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;
  const allowDownload =
    props.settings && props.settings.allowDownload !== undefined ? props.settings.allowDownload : false;
  const styleRules =
    extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules
      ? props.settings.styleRules
      : [];
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const useStyles = generateClassDefinitionsBasedOnRules(styleRules);
  const classes = useStyles();
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

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
        return ApplyColumnType(
          {
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

  function actionRule(rule, e) {
    if (rule !== null && rule.customization == 'set variable' && props && props.setGlobalParameter) {
      // call thunk for $neodash_customizationValue
      let rValue = rule.value == 'id' ? 'id ' : rule.value;
      if (rValue != '' && e.row[rValue]) {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.row[rValue]);
      } else {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.value);
      }
    }
  }

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
        rows={rows}
        columns={columns}
        columnVisibilityModel={hiddenColumns}
        onCellClick={(e) => {
          let rule = getRule(e, actionsRules, 'Click');
          actionRule(rule, e);
        }}
        onCellDoubleClick={(e) => {
          let rule = getRule(e, actionsRules, 'doubleClick');
          if (rule !== null) {
            actionRule(rule, e);
          } else {
            setNotificationOpen(true);
            navigator.clipboard.writeText(e.value);
          }
        }}
        pageSize={
          Math.floor((props.dimensions.height - TABLE_HEADER_HEIGHT - TABLE_FOOTER_HEIGHT) / TABLE_ROW_HEIGHT) - 1
        }
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
