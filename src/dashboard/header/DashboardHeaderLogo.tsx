import React from 'react';

import { APPLY_CUSTOM_BRAND_LOGO, DASHBOARD_HEADER_BRAND_LOGO } from '../../config/ApplicationConfig';
import StyleConfig from '../../config/StyleConfig';

await StyleConfig.getInstance();

export const NeoDashboardHeaderLogo = () => {
  const brandedToolbarContent = (
    <img className='n-justify-start n-h-6 n-w-auto n-m-2' src={DASHBOARD_HEADER_BRAND_LOGO} />
  );
  const content = <div className='n-items-center'>{APPLY_CUSTOM_BRAND_LOGO ? brandedToolbarContent : null}</div>;

  return content;
};

export default NeoDashboardHeaderLogo;
