import React from 'react';

import { DASHBOARD_HEADER_BRAND_LOGO } from '../../config/ApplicationConfig';
import StyleConfig from '../../config/StyleConfig';

await StyleConfig.getInstance();

export const NeoDashboardHeaderLogo = () => {
  const content = (
    <div className='n-items-center sm:n-flex md:n-flex-1 n-justify-start'>
      <img className='n-h-6 n-w-auto n-m-2' src={DASHBOARD_HEADER_BRAND_LOGO} />
    </div>
  );

  return content;
};

export default NeoDashboardHeaderLogo;
