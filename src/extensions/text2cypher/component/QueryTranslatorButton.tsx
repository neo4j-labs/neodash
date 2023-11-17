import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import QueryTranslatorSettingsModal from './QueryTranslatorSettingsModal';
import { ExclamationTriangleIconSolid, LanguageIconSolid } from '@neo4j-ndl/react/icons';
import { getModelProvider } from '../state/QueryTranslatorSelector';

const QueryTranslatorButton = (active) => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <IconButton className='n-mx-1' aria-label='Text2Cypher' onClick={() => setOpen(true)}>
      <LanguageIconSolid />
      {active.active == '' || active.active == undefined ? (
        <ExclamationTriangleIconSolid color='red' className='-n-mt-1 n-ml-3 n-w-4/5'></ExclamationTriangleIconSolid>
      ) : (
        <></>
      )}
    </IconButton>
  );

  const component = (
    <div style={{ display: 'inline' }}>
      {button}
      {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (state) => ({
  active: getModelProvider(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorButton);
