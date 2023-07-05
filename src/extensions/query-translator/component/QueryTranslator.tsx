import React from 'react';
import { connect } from 'react-redux';
import { SideNavigationItem } from '@neo4j-ndl/react';
import QueryTranslatorSettingsModal from './QueryTranslatorSettingsModal';
import { Tooltip } from '@mui/material';
import { ExclamationTriangleIconSolid, LanguageIconSolid } from '@neo4j-ndl/react/icons';
import { getModelProvider } from '../state/QueryTranslatorSelector';

const QueryTranslatorButton = (active) => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <div>
      <Tooltip title={'Natural Language Queries'} aria-label='examples'>
        <SideNavigationItem
          onClick={() => setOpen(true)}
          icon={
            <>
              <LanguageIconSolid

              // className={navItemClass}
              />
              {/* TODO Use Needle Icon Badges when implemented. */}
              {active.active == '' || active.active == undefined ? (
                <ExclamationTriangleIconSolid
                  color='red'
                  style={{
                    marginTop: '-26px',
                    marginLeft: '11px',
                  }}
                ></ExclamationTriangleIconSolid>
              ) : (
                <></>
              )}
            </>
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

const mapStateToProps = (state) => ({
  active: getModelProvider(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorButton);
