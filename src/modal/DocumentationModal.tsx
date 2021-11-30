
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Badge from '@material-ui/core/Badge';
import { Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import NeoEditableCodeField from '../component/EditableCodeField';
import NeoReport from '../report/Report';
import { EXAMPLE_REPORTS } from '../config/ExampleConfig';



export const NeoDocumentationModal = ({ database }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Documentation" />
            </ListItem>

            {open ? <Dialog maxWidth={"xl"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Documentation - Example Usage
                    <IconButton onClick={handleClose} style={{ padding: "3px", float: "right" }}>
                        <Badge badgeContent={""} >
                            <CloseIcon />
                        </Badge>
                    </IconButton>
                </DialogTitle>
                <div>
                <DialogContent >
                    <hr></hr>
                    {EXAMPLE_REPORTS.map(example => {
                        return <>
                            <h3>{example.title}</h3>
                            <DialogContentText>{example.description}
                            <br/>
                            <br/>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <div style={{  width: "400px", border: "0px solid lightgrey" }} >
                                        <NeoEditableCodeField editable={false} placeholder="" value={example.exampleQuery}></NeoEditableCodeField>
                                    </div>
                                </Grid>

                                <Grid item xs={8}>
                                    <div style={{ height: "355px", width: "800px", overflow: "hidden", border: "1px solid lightgrey" }} >
                                        <NeoReport
                                            query={example.syntheticQuery}
                                            database={database}
                                            disabled={!open}
                                            selection={example.selection}
                                            settings={example.settings}
                                            fields={example.fields}
                                            dimensions={example.dimensions}
                                            ChartType={example.chartType}
                                            type = {example.type}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                            </DialogContentText>
                            <hr></hr>
                        </>
                    })}
                </DialogContent>
                </div>
            </Dialog> : <></>}
        </div>
    );
}

export default (NeoDocumentationModal);


