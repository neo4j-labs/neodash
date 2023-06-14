import React from 'react';
import { connect } from 'react-redux';
import { SideNavigationItem } from '@neo4j-ndl/react';
import QueryTranslatorSettingsModal from './QueryTranslatorSettingsModal';
import { Tooltip } from '@mui/material';
import { LanguageIconSolid } from '@neo4j-ndl/react/icons';
/**
 * //TODO:
 * 2. When changing the modeltype, reset all the history of messages
 * 3. create system message from here to prevent fucking all up during the thunk, o each modelProvider change and at the start pull all the db schema
 */

export const QueryTranslatorButton = () => {
  const [open, setOpen] = React.useState(false);

  const button = (
    <div>
      <Tooltip title='Natural Language Queries' aria-label='examples'>
        <SideNavigationItem
          onClick={() => setOpen(true)}
          icon={
            <LanguageIconSolid
            // className={navItemClass}
            />
          }
        >
          Natural Language Queries
        </SideNavigationItem>
      </Tooltip>
    </div>
  );

  const component = (
    <div>
      {button}
      {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorButton);
