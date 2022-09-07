
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { HeroIcon, IconButton, Dialog } from '@neo4j-ndl/react';

const formatProperty = (property) => {
    if (property.startsWith("http://") || property.startsWith("https://")) {
        return <a href={property}>{property}</a>;
    }
    return property;
}

export const NeoGraphItemInspectModal = ({ open, handleClose, title, object, textAlign = "left" }) => {
    return (
        <div>
            <Dialog size="large" open={open == true} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                    {title}
                </Dialog.Header>
                <Dialog.Content>
                    {object &&
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {Object.keys(object).length == 0 ?
                                        <i>(No properties)</i> :
                                        Object.keys(object).sort().map((key) => (
                                            <TableRow key={key}>
                                                <TableCell component="th" scope="row">
                                                    {key}
                                                </TableCell>
                                                <TableCell align={textAlign}>{formatProperty(object[key].toString())}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Dialog.Content>
            </Dialog>
        </div >
    );
}

export default (NeoGraphItemInspectModal);


