import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { getEntityHeader } from '../util/NodeUtils';

export const showInspectModal = useCallback((item, showPropertiesOnClick, setInspectItem, setInspectModalOpen) => {
  if (showPropertiesOnClick) {
    setInspectItem(item);
    setInspectModalOpen(true);
  }
}, []);

export const formatProperty = (property) => {
  if (property.startsWith('http://') || property.startsWith('https://')) {
    return <a href={property}>{property}</a>;
  }
  return property;
};

export const NeoGraphChartInspectModal = (props: GraphChartVisualizationProps) => {
  return (
    <div>
      <Dialog
        maxWidth={'lg'}
        open={props.interactivity.showPropertyInspector}
        onClose={() => props.interactivity.setPropertyInspectorOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {getEntityHeader(props.interactivity.selectedEntity)}
          <IconButton
            onClick={() => props.interactivity.setPropertyInspectorOpen(false)}
            style={{ padding: '3px', marginLeft: '20px', float: 'right' }}
          >
            <Badge overlap='rectangular' badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {props.interactivity.selectedEntity && (
            <TableContainer>
              <Table size='small'>
                <TableBody>
                  {Object.keys(props.interactivity.selectedEntity.properties).length == 0 ? (
                    <i>(No properties)</i>
                  ) : (
                    Object.keys(props.interactivity.selectedEntity.properties)
                      .sort()
                      .map((key) => (
                        <TableRow key={key}>
                          <TableCell component='th' scope='row'>
                            {key}
                          </TableCell>
                          <TableCell align={'left'}>
                            {formatProperty(
                              props.interactivity.selectedEntity &&
                                props.interactivity.selectedEntity.properties[key].toString()
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeoGraphChartInspectModal;
