import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IconButton, Menu, MenuItems, MenuItem } from '@neo4j-ndl/react';
import {
  QuestionMarkCircleIconOutline,
  BookOpenIconOutline,
  InformationCircleIconOutline,
} from '@neo4j-ndl/react/icons';
import { Tooltip } from '@mui/material';

import { DASHBOARD_HEADER_BUTTON_COLOR } from '../../config/ApplicationConfig';
import StyleConfig from '../../config/StyleConfig';
import { getDashboardExtensions } from '../DashboardSelectors';
import { getExampleReports } from '../../extensions/ExtensionUtils';
import { NeoReportExamplesModal } from '../../modal/ReportExamplesModal';

await StyleConfig.getInstance();

export const NeoAboutButton = ({ connection, extensions, onAboutModalOpen }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleHelpMenuOpen = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleHelpMenuClose = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={'Help and documentation'} disableInteractive>
        <IconButton
          className='logo-btn n-p-1'
          aria-label={'help'}
          style={DASHBOARD_HEADER_BUTTON_COLOR ? { color: DASHBOARD_HEADER_BUTTON_COLOR } : {}}
          size='large'
          onClick={handleHelpMenuOpen}
          clean
        >
          <QuestionMarkCircleIconOutline className='header-icon' type='outline' />
        </IconButton>
      </Tooltip>
      <Menu
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleHelpMenuClose}
        size='large'
      >
        <MenuItems>
          <NeoReportExamplesModal
            extensions={extensions}
            examples={getExampleReports(extensions)}
            database={connection.database}
          ></NeoReportExamplesModal>
          <MenuItem
            title={
              <a
                className='n-flex n-flex-row n-gap-token-4'
                target='_blank'
                rel='noreferrer'
                href='https://neo4j.com/labs/neodash/2.3/user-guide/'
              >
                <BookOpenIconOutline className='n-w-4 n-h-4 n-text-light-neutral-text-weak n-inline-block' />
                Documentation
              </a>
            }
          />
          <MenuItem title={'About'} onClick={onAboutModalOpen} icon={<InformationCircleIconOutline />} />
        </MenuItems>
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => ({
  extensions: getDashboardExtensions(state),
});

export default connect(mapStateToProps, null)(NeoAboutButton);
