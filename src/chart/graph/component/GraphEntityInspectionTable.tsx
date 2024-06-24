import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TextLink } from '@neo4j-ndl/react';
// import DOMPurify from 'dompurify';

export const formatProperty = (property) => {
  const str = property?.toString() || '';
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return (
      <TextLink externalLink href={str}>
        {str}
      </TextLink>
    );
  }
  return str;
};

/**
 * Component to render node/relationship properties in a table format
 */
export const GraphEntityInspectionTable = ({
  entity,
  theme,
  setSelectedParameters = (_value) => {
    console.log('undefined function in GraphEntityInspectionTable');
  },
  checklistEnabled = false,
  customTableDataSettingsForEntityType,
}) => {
  const [checkedParameters, setCheckedParameters] = React.useState<string[]>([]);
  const hasPropertyToShow = Object.keys(entity.properties).length > 0;
  /**
   * Set keys which needs to be displayed first in defined order
   */
  const orderedAttributeList = customTableDataSettingsForEntityType?.ordering || [];

  /**
   * Set rest of the keys in asc order which should render after the orderedAttributeList
   */
  const unorderedAttributeList = Object.keys(entity.properties).filter(
    (value: string) => !orderedAttributeList.includes(value)
  );

  if (!entity) {
    return <></>;
  }

  /**
   * Function to manage the click
   * @param parameter
   * @param checked
   */
  function handleCheckboxClick(parameter, checked) {
    let newCheckedParameters = [...checkedParameters];
    if (checked) {
      newCheckedParameters.push(parameter);
    } else {
      const index = newCheckedParameters.indexOf(parameter);
      if (index > -1) {
        newCheckedParameters.splice(index, 1);
      }
    }
    if (setSelectedParameters) {
      setCheckedParameters(newCheckedParameters);
      setSelectedParameters(newCheckedParameters);
    }
  }

  const tableTextColor = theme === 'dark' ? 'var(--palette-dark-neutral-border-strong)' : 'rgba(0, 0, 0, 0.6)';

  const attributesList = (key: any) => (
    <TableRow key={key}>
      <TableCell component='th' scope='row'>
        {key}
      </TableCell>
      <TableCell align={'left'}>
        <ShowMoreText lines={2}>{formatProperty(entity && entity.properties[key].toString())}</ShowMoreText>
      </TableCell>
      {checklistEnabled ? (
        <TableCell align={'center'}>
          <Checkbox
            color='default'
            onChange={(event) => {
              handleCheckboxClick(key, event.target.checked);
            }}
          />
        </TableCell>
      ) : (
        <></>
      )}
    </TableRow>
  );

  const filterCustomDataSettingsForEntityTypeHide = (attr: string) =>
    !(customTableDataSettingsForEntityType?.hide || []).includes(attr);

  return (
    <TableContainer>
      <Table size='small'>
        {hasPropertyToShow ? (
          <TableHead>
            <TableRow>
              <TableCell align='left' style={{ color: tableTextColor }}>
                Property
              </TableCell>
              <TableCell align='left' style={{ color: tableTextColor }}>
                Value
              </TableCell>
              {checklistEnabled ? <TableCell align='center'>Select Property</TableCell> : <></>}
            </TableRow>
          </TableHead>
        ) : (
          <></>
        )}
        <TableBody>
          {!hasPropertyToShow ? (
            <TableRow key='empty-row'>
              <TableCell component='th' scope='row'>
                (No properties)
              </TableCell>
            </TableRow>
          ) : (
            <>
              {orderedAttributeList.filter(filterCustomDataSettingsForEntityTypeHide).map((key: string) => {
                if (entity && entity.properties[key]) {
                  return attributesList(key);
                }
              })}
              {unorderedAttributeList
                .filter(filterCustomDataSettingsForEntityTypeHide)
                .sort()
                .map((key: string) => attributesList(key))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphEntityInspectionTable;
