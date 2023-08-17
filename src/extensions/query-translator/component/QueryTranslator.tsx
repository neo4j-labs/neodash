import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from '@neo4j-ndl/react';
import QueryTranslatorSettingsModal from './QueryTranslatorSettingsModal';
import { ExclamationTriangleIconSolid, LanguageIconSolid } from '@neo4j-ndl/react/icons';
import { getModelProvider } from '../state/QueryTranslatorSelector';

const QueryTranslatorButton = (active) => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <MenuItem
      title='Natural Language Queries'
      onClick={() => setOpen(true)}
      icon={
        <>
          <LanguageIconSolid />
          {/* TODO Use Needle Icon Badges when implemented. */}
          {active.active == '' || active.active == undefined ? (
            <ExclamationTriangleIconSolid color='red' className='-n-mt-1 n-ml-2 n-w-4/5'></ExclamationTriangleIconSolid>
          ) : (
            <></>
          )}
        </>
      }
    />
  );

  const component = (
    <div>
      {button}
      {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (state) => ({
  active: getModelProvider(state),
});

export default connect(mapStateToProps, null)(QueryTranslatorButton);
