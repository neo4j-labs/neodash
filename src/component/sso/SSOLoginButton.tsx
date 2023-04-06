import React, { useEffect, useState } from 'react';
import { authRequestForSSO } from 'neo4j-client-sso';
import { getDiscoveryDataInfo } from './SSOUtils';
import { ShieldCheckIconOutline } from '@neo4j-ndl/react/icons';
import { IconButton } from '@neo4j-ndl/react';

export const SSOLoginButton = ({ discoveryAPIUrl, onSSOAttempt }) => {
  const [savedSSOProviders, setSSOProviders] = useState([]);

  useEffect(() => {
    getDiscoveryDataInfo(discoveryAPIUrl)
      .then((mergedSSOProviders) => setSSOProviders(mergedSSOProviders))
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error in getDiscoveryDataInfo of Login component', err));
  }, []);

  return (
    <>
      {savedSSOProviders?.length ? (
        savedSSOProviders.map((provider) => (
          <IconButton
            key={provider.id}
            style={{ float: 'right', marginTop: '20px', marginBottom: '20px', backgroundColor: 'white' }}
            onClick={() => {
              const selectedSSOProvider = savedSSOProviders.find(({ id }) => id === provider.id);
              onSSOAttempt();
              authRequestForSSO(selectedSSOProvider);
            }}
          >
            Sign in
            <ShieldCheckIconOutline className='btn-icon-base-r' />
          </IconButton>
        ))
      ) : (
        <div>
          <p>
            No SSO providers found or present. Make sure that config.json contains a correct discovery URL. This is
            currently set to <a href={discoveryAPIUrl}>{discoveryAPIUrl}</a>
            <div className=''></div>
          </p>
        </div>
      )}
    </>
  );
};
