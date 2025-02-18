import React, { useEffect, useState } from 'react';
import { SSOProviderOriginal, authRequestForSSO } from 'neo4j-client-sso';
import { getDiscoveryDataInfo } from './SSOUtils';
import { ShieldCheckIconOutline } from '@neo4j-ndl/react/icons';
import { Button, IconButton } from '@neo4j-ndl/react';

export const SSOLoginButton = ({ discoveryAPIUrl, hostname, port, onSSOAttempt, onClick, providers }) => {
  const [savedSSOProviders, setSSOProviders] = useState([]);
  const [discoveryUrlValidated, setDiscoveryUrlValidated] = useState<string | undefined>(undefined);

  const filterByProvidersList = (discoveredProviders, validProviders) => {
    return validProviders == null || validProviders.length == 0
      ? discoveredProviders
      : discoveredProviders.filter((p) => validProviders.includes(p.id));
  };
  const attemptManualSSOProviderRetrieval = () => {
    // Do an extra check to see if the hostname provides some SSO provider configuration.
    const protocol = isLocalhost(hostname) ? 'http' : 'https';
    const discoveryUrl = `${protocol}://${hostname}:${port}`;
    getDiscoveryDataInfo(discoveryUrl)
      .then((mergedSSOProviders) => {
        setSSOProviders(filterByProvidersList(mergedSSOProviders, providers));
        if (mergedSSOProviders.length == 0) {
          setDiscoveryUrlValidated(undefined);
        } else {
          setDiscoveryUrlValidated(discoveryUrl);
        }
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error in getDiscoveryDataInfo of Login component', err));
  };

  function isLocalhost(hostname) {
    const localhostNames = ['localhost', '127.0.0.1', '::1'];
    return localhostNames.includes(hostname);
  }

  useEffect(() => {
    // First, try to get the SSO discovery URL from the config.json configuration file and see if it contains anything.
    getDiscoveryDataInfo(discoveryAPIUrl)
      .then((mergedSSOProviders) => {
        setSSOProviders(filterByProvidersList(mergedSSOProviders, providers));
        if (mergedSSOProviders.length == 0) {
          attemptManualSSOProviderRetrieval();
        } else {
          setDiscoveryUrlValidated(discoveryAPIUrl);
        }
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error in getDiscoveryDataInfo of Login component', err));
  }, [hostname]);

  return (
    <>
      {savedSSOProviders?.length ? (
        savedSSOProviders.map((provider) => (
          <Button
            floating
            aria-label={'sso select'}
            style={{ float: 'right' }}
            onClick={() => {
              // TODO - if we have SSO credentials cached, try and use those first, if fail, do a call to the SSO provider.
              const selectedSSOProvider = savedSSOProviders.find(({ id }) => id === provider.id);
              onClick();
              onSSOAttempt(discoveryUrlValidated);
              authRequestForSSO(selectedSSOProvider);
            }}
          >
            Sign in
            <ShieldCheckIconOutline className='btn-icon-base-r' aria-label={'Shield'} />
          </Button>
        ))
      ) : (
        <div>
          {!discoveryUrlValidated ? (
            <p style={{ fontSize: 11, color: 'grey', marginTop: 5 }}>
              No default SSO providers found for the database {hostname}. Deploy this application with https and/or set
              a manual SSO provider inside config.json.
              <div className=''></div>
            </p>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};
