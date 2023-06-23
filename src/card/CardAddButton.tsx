import React from 'react';
import { connect } from 'react-redux';
import { Card, CardContent } from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import { SquaresPlusIconOutline } from '@neo4j-ndl/react/icons';

/**
 * Button to add a new report to the current page.
 */
const NeoAddNewCard = ({ onCreatePressed }) => {
  return (
    <div>
      <Card className='n-bg-dark-neutral-text-weak'>
        <CardContent style={{ height: '429px' }}>
          <IconButton
            aria-label='add report'
            className='centered'
            onClick={() => {
              onCreatePressed();
            }}
            size='large'
            floating
          >
            <SquaresPlusIconOutline />
          </IconButton>
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAddNewCard);
