import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TextLink } from '@neo4j-ndl/react';

export const formatProperty = (property) => {
  if (property.startsWith('http://') || property.startsWith('https://')) {
    return (
      <TextLink externalLink href={property}>
        {property}
      </TextLink>
    );
  }
  return property.split(',').join(', ');
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
            <TableRow key='empty-row'>
              <TableCell component='th' scope='row'>
                (No properties)
              </TableCell>
            </TableRow>
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
