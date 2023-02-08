import React, { useEffect, useState } from 'react';
import { authRequestForSSO } from 'neo4j-client-sso';
import { getDiscoveryDataInfo } from './SSOUtils';
import { Button } from '@material-ui/core';
import SecurityIcon from '@material-ui/icons/Security';

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
          <Button
            key={provider.id}
            style={{ float: 'right', marginTop: '20px', marginBottom: '20px', backgroundColor: 'white' }}
            onClick={() => {
              const selectedSSOProvider = savedSSOProviders.find(({ id }) => id === provider.id);
              onSSOAttempt();
              authRequestForSSO(selectedSSOProvider);
            }}
            color='default'
            variant='contained'
            size='large'
            endIcon={<SecurityIcon />}
          >
            Sign in
            {/* {provider.name} */}
          </Button>
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
