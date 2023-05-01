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
 * @param entity
 * @param setParamList function to set the list of checked value inside the compoenent calling GraphEntityInspectionTable
 */
export const GraphEntityInspectionTable = ({
  entity,
  setParamList = (_value) => {
    console.log('undefined function in GraphEntityInspectionTable');
  },
  hideCheckList = true,
}) => {
  const [checkedList, setCheckedList] = React.useState<string[]>([]);
  const hasPropertyToShow = Object.keys(entity.properties).length > 0;
  if (!entity) {
    return <></>;
  }

  /**
   * Function to manage the click
   * @param paramName
   * @param checked
   */
  function manageCheck(paramName, checked) {
    let tmp = [...checkedList];
    if (checked) {
      tmp.push(paramName);
    } else {
      const index = tmp.indexOf(paramName);
      if (index > -1) {
        tmp.splice(index, 1);
      }
    }
    if (setParamList) {
      setCheckedList(tmp);
      setParamList(tmp);
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
              {!hideCheckList ? <TableCell align='center'>Select Property</TableCell> : <></>}
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
                  {!hideCheckList ? (
                    <TableCell align={'center'}>
                      <Checkbox
                        color='default'
                        onChange={(event) => {
                          manageCheck(key, event.target.checked);
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
