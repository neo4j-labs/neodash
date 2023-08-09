import React from 'react';
import { ChartProps } from '../../../chart/Chart';
import { Button, TextInput, Tag } from '@neo4j-ndl/react';
import { PlayIconSolid } from '@neo4j-ndl/react/icons';
/**
 * Renders a form.
 */
const NeoForm = (props: ChartProps) => {
  const { records, settings } = props;
  const buttonText = settings?.runButtonText ? settings.runButtonText : 'Send';

  const submitted = React.useState(false);

  // The user is still entering the form's fields...
  if (!submitted) {
    return (
      <div style={{ margin: '10px' }}>
        <Button onClick={() => {}}>
          {buttonText}
          <PlayIconSolid className='btn-icon-base-r' />
        </Button>
      </div>
    );
  }

  // The user has completed the form.
  return (
    <div style={{ margin: '10px' }}>
      <Button onClick={() => {}}>Reset form</Button>
    </div>
  );
};

export default NeoForm;
