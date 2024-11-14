import React, { useEffect } from 'react';
import { DataGrid, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { ChartProps } from '../Chart';
import {
  evaluateRulesOnDict,
  evaluateSingleRuleOnDict,
  generateClassDefinitionsBasedOnRules,
  useStyleRules,
} from '../../extensions/styling/StyleRuleEvaluator';
import { Tooltip, Snackbar } from '@mui/material';
import { downloadCSV } from '../ChartUtils';
import { getRendererForValue, rendererForType, RenderSubValue } from '../../report/ReportRecordProcessing';

import {
  getRule,
  executeActionRule,
  getPageNumbersAndNamesList,
  performActionOnElement,
} from '../../extensions/advancedcharts/Utils';

import { IconButton } from '@neo4j-ndl/react';
import { CloudArrowDownIconOutline, XMarkIconOutline } from '@neo4j-ndl/react/icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { extensionEnabled } from '../../utils/ReportUtils';
import { getCheckboxes, hasCheckboxes, updateCheckBoxes } from './TableActionsHelper';

const TABLE_ROW_HEIGHT = 52;
const HIDDEN_COLUMN_PREFIX = '__';
const theme = createTheme({
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
    allVariants: { color: 'rgb(var(--palette-neutral-text-default))' },
  },
});
const fallbackRenderer = (value) => {
  return JSON.stringify(value);
};

function renderAsButtonWrapper(renderer) {
  return function renderAsButton(value) {
    const outputValue = renderer(value, true);
    // If there's nothing to be rendered, there's no button needed.
    if (outputValue == '') {
      return <></>;
    }
    return (
      <Button style={{ width: '100%', marginLeft: '5px', marginRight: '5px' }} variant='contained' color='primary'>
        {outputValue}
      </Button>
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
  const wrapContent = props.settings && props.settings.wrapContent ? props.settings.wrapContent : false;
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
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({});

  const useStyles = generateClassDefinitionsBasedOnRules(styleRules);
  const classes = useStyles();
  const tableRowHeight = compact ? TABLE_ROW_HEIGHT / 2 : TABLE_ROW_HEIGHT;

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

  const actionableFields = actionsRules.filter((r) => r.condition !== 'rowCheck').map((r) => r.field);
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
    : records[0] &&
      records[0].keys &&
      records[0].keys.map((key, i) => {
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

  useEffect(() => {
    const hiddenColumns = Object.assign(
      {},
      ...columns.filter((x) => x.field.startsWith(HIDDEN_COLUMN_PREFIX)).map((x) => ({ [x.field]: false }))
    );
    setColumnVisibilityModel(hiddenColumns);
  }, [records]);

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }
  const getTransposedRows = (records) => {
    // Skip first key
    const rowKeys = [...records[0].keys];
    rowKeys.shift();

    // Add values in rows
    const rowsWithValues = rowKeys.map((key, i) =>
      Object.assign(
        { id: i, Field: key },
        ...records.map((record, j) => ({
          // Note the true here is for the rendered to know we are inside a transposed table
          // It will be needed for rendering the records properly, if they are arrays
          [`${record._fields[0]}_${j + 1}`]: RenderSubValue(record._fields[i + 1], true),
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

  const pageNames = getPageNumbersAndNamesList();
  const customStyles = { '&.MuiDataGrid-root .MuiDataGrid-footerContainer > div': { marginTop: '0px' } };

  const commonGridProps = {
    key: 'tableKey',
    columnHeaderHeight: 32,
    rowHeight: tableRowHeight,
    autoPageSize: true,
    rows: rows,
    columns: columns,
    columnVisibilityModel: columnVisibilityModel,
    onColumnVisibilityModelChange: (newModel) => setColumnVisibilityModel(newModel),
    onCellClick: (e) => performActionOnElement(e, actionsRules, { ...props, pageNames: pageNames }, 'Click', 'Table'),
    onCellDoubleClick: (e) => {
      let rules = getRule(e, actionsRules, 'doubleClick');
      if (rules !== null) {
        rules.forEach((rule) => executeActionRule(rule, e, { ...props, pageNames: pageNames }, 'table'));
      } else {
        setNotificationOpen(true);
        navigator.clipboard.writeText(e.value);
      }
    },
    checkboxSelection: hasCheckboxes(actionsRules),
    rowSelectionModel: getCheckboxes(actionsRules, rows, props.getGlobalParameter),
    onRowSelectionModelChange: (selection) => updateCheckBoxes(actionsRules, rows, selection, props.setGlobalParameter),
    disableRowSelectionOnClick: true,
    components: {
      ColumnSortedDescendingIcon: () => <></>,
      ColumnSortedAscendingIcon: () => <></>,
    },
    // TODO: if mixing and matching row and cell styling, row rules MUST be set first or will not populate correctly
    getRowClassName: (params) => {
      return ['row color', 'row text color']
        .map((e) => {
          return `rule${evaluateRulesOnDict(params.row, styleRules, [e])}`;
        })
        .join(' ');
    },
    getCellClassName: (params) => {
      return ['cell color', 'cell text color']
        .map((e) => {
          let trueRulesList = [''];
          let trueRule;
          for (const [index, rule] of styleRules.entries()) {
            if (rule.targetField) {
              if (rule.targetField === params.field) {
                trueRule = `rule${evaluateSingleRuleOnDict({ [rule.field]: params.row[rule.field] }, rule, index, [e])}`;
              }
            } else {
              trueRule = `rule${evaluateSingleRuleOnDict({ [params.field]: params.value }, rule, index, [e])}`;
            }
            trueRulesList.push(trueRule);
          }
          return trueRulesList.join(' ');
        })
        .join(' ');
    },
  };

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
              <IconButton
                size='small'
                aria-label='close'
                color='inherit'
                onClick={() => setNotificationOpen(false)}
                clean
              >
                <XMarkIconOutline />
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
              className='n-absolute n-z-10 n-bottom-2 n-left-1'
              clean
            >
              <CloudArrowDownIconOutline />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}

        {wrapContent ? (
          <DataGrid
            {...commonGridProps}
            getRowHeight={() => 'auto'}
            sx={{
              ...customStyles,
              '&.MuiDataGrid-root .MuiDataGrid-cell': { wordBreak: 'break-word' },
            }}
          />
        ) : (
          <DataGrid {...commonGridProps} sx={customStyles} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default NeoTableChart;
