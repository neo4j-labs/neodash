import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

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
