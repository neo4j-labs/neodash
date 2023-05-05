import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

export const formatProperty = (property) => {
  if (property.startsWith('http://') || property.startsWith('https://')) {
    return <a href={property}>{property}</a>;
  }
  return property;
};

/**
 * Component to render node/relationship properties in a table format
 * @param param0
 * @returns
 */
export const GraphEntityInspectionTable = ({ entity }) => {
  if (!entity) {
    return <></>;
  }
  return (
    <TableContainer>
      <Table size='small'>
        <TableBody>
          {Object.keys(entity.properties).length == 0 ? (
            <i>(No properties)</i>
          ) : (
            Object.keys(entity.properties)
              .sort()
              .map((key) => (
                <TableRow key={key}>
                  <TableCell component='th' scope='row'>
                    {key}
                  </TableCell>
                  <TableCell align={'left'}>{formatProperty(entity && entity.properties[key].toString())}</TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphEntityInspectionTable;
