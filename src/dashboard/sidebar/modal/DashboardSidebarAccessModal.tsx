import React from 'react';
import { Button, Dialog, Dropdown } from '@neo4j-ndl/react';
import { createDriver } from 'use-neo4j';
import { version } from '../../../modal/AboutModal';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarAccessModal = ({ open, dashboard,dashboardDatabase,connection, onConfirm, handleClose }) => {
 
const [driver, setDriver] = React.useState(undefined);

  
const labelOptions = async () => {
    // If no driver is yet instantiated, create a new one.
    if (driver === undefined) {
      const newDriver = createDriver(
        connection.protocol,
        connection.url,
        connection.port,
        connection.username,
        connection.password,
        { userAgent: `neodash/v${version}` }
      );
      setDriver(newDriver);
  
      try {
        const session = newDriver.session({ database: dashboardDatabase });
  
        const result = await session.run('MATCH (n) RETURN DISTINCT labels(n) as labels');
  
        // Close the session when done
        await session.close();
  
        // Process the result and return the label options
        return result.records.flatMap((record) =>
          record.get('labels').map((label) => ({
            value: label,
            label: label,
          }))
        );
      } catch (error) {
        console.error('Error fetching label options:', error);
        return []; // Return an empty array in case of an error
      }
    }
  
    return []; // Return an empty array if the driver is already defined
  };

  

return (
    <Dialog size='small' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Dasboard Access Control - '{dashboard.title}'</Dialog.Header>
      <Dialog.Content>
        Welcome to the Dashboard Access settings! This window empowers you to fine-tune
        <br />
        who can access your dashboards through the use of labels.
      </Dialog.Content>
      <Dropdown selectProps={{isMulti:true,options:labelOptions()}} id='type'
        label='Add additional labels to current dashboard'
        type='select'
        helpText='You can select more than one label value' 
        fluid
        style={{ marginLeft: '0px', marginRight: '10px', width: '47%', maxWidth: '200px', display: 'inline-block' }} /> 
      <Dialog.Actions>
        <Button onClick={handleClose} style={{ float: 'right' }} fill='outlined' floating>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            handleClose();
          }}
          color='primary'
          style={{ float: 'right', marginRight: '10px' }} floating>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>

  );
};

export default NeoDashboardSidebarAccessModal;
