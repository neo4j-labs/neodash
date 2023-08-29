import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Card } from '@mui/material';
import ReactDOMServer from 'react-dom/server';
import { GraphEntity, Link } from '../GraphChartVisualization';
import { Node } from '../GraphChartVisualization';

/**
 * Renders a tooltip above the user's cursor showing information on the selected node/relationship.
 */
export function getTooltip(entity: Node | Link) {
  const tooltip = (
    <Card>
      <b style={{ padding: '10px' }}>
        {entity.labels ? (entity.labels.length > 0 ? entity.labels.join(', ') : 'Node') : entity.type}
      </b>
      {Object.keys(entity.properties).length == 0 ? (
        <i>
          <br />
          (No properties)
        </i>
      ) : (
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {Object.keys(entity.properties)
                .sort()
                .map((key) => (
                  <TableRow key={key}>
                    <TableCell component='th' scope='row' style={{ padding: '3px', paddingLeft: '8px' }}>
                      {key}
                    </TableCell>
                    <TableCell align={'left'} style={{ padding: '3px', paddingLeft: '8px' }}>
                      {entity.properties[key].toString().length <= 30
                        ? entity.properties[key].toString()
                        : `${entity.properties[key].toString().substring(0, 40)}...`}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
  return ReactDOMServer.renderToString(tooltip);
}
