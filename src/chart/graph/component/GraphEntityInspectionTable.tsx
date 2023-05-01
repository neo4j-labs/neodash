import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import ShowMoreText from 'react-show-more-text';
import { Checkbox, TableHead } from '@material-ui/core';

export const formatProperty = (property) => {
  if (property.startsWith('http://') || property.startsWith('https://')) {
    return <a href={property}>{property}</a>;
  }
  return property;
};

/**
 * Component to render node/relationship properties in a table format
 */
export const GraphEntityInspectionTable = ({
  entity,
  setSelectedParameters = (_value) => {
    console.log('undefined function in GraphEntityInspectionTable');
  },
  checklistEnabled = false,
}) => {
  const [checkedParameters, setCheckedParameters] = React.useState<string[]>([]);
  const hasPropertyToShow = Object.keys(entity.properties).length > 0;
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

  return (
    <TableContainer>
      <Table size='small'>
        {hasPropertyToShow ? (
          <TableHead>
            <TableRow>
              <TableCell align='left'>Property</TableCell>
              <TableCell align='left'>Value</TableCell>
              {checklistEnabled ? <TableCell align='center'>Select Property</TableCell> : <></>}
            </TableRow>
          </TableHead>
        ) : (
          <></>
        )}
        <TableBody>
          {!hasPropertyToShow ? (
            <i>(No properties)</i>
          ) : (
            Object.keys(entity.properties)
              .sort()
              .map((key) => (
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
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphEntityInspectionTable;
