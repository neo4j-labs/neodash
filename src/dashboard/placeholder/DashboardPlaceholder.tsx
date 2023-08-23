import React from 'react';
import { LoadingSpinner } from '@neo4j-ndl/react';
import { BoltIconSolid } from '@neo4j-ndl/react/icons';
import { NeoDashboardHeaderLogo } from '../header/DashboardHeaderLogo';

export const NeoDashboardPlaceholder = () => {
  return (
    <>
      <div className='n-w-screen n-flex n-flex-row n-items-center n-bg-neutral-bg-weak n-border-b n-border-neutral-border-weak'>
        <div className='n-relative n-bg-neutral-bg-weak n-w-full'>
          <div className='n-min-w-full'>
            <div className='n-flex n-justify-between n-h-16 n-items-center n-py-6 md:n-justify-start md:n-space-x-10 n-mx-4'>
              <NeoDashboardHeaderLogo />
              <nav className='n-items-center n-justify-center n-flex n-flex-1 n-w-full'>
                NeoDash <BoltIconSolid className='icon-base' color='gold' />
              </nav>
              <div className='sm:n-flex n-items-center n-justify-end md:n-flex-1 lg:n-w-0 n-gap-6'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='n-w-full n-h-full n-overflow-y-scroll n-flex n-flex-row'>
        <div className='n-flex-1 n-relative n-z-0  n-scroll-smooth n-w-full'>
          <div className='n-absolute n-inset-0 page-spacing'>
            <div className='page-spacing-overflow'>
              <div className='n-absolute n-w-full n-h-full'>
                <LoadingSpinner size='large' className='centered' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeoDashboardPlaceholder;
