import {
  authLog,
  getSSOServerIdIfShouldRedirect,
  authRequestForSSO,
  handleAuthFromRedirect,
  removeSearchParamsInBrowserHistory,
  restoreSearchAndHashParams,
  wasRedirectedBackFromSSOServer,
  defaultSearchParamsToRemoveAfterAutoRedirect,
  getInitialisationParameters,
  fetchDiscoveryDataFromUrl,
  Success,
  NoProviderError,
} from 'neo4j-client-sso';

export const getDiscoveryDataInfo = async (discoveryAPIurl) => {
  //
  // These are the three different "sources" that we (potentially) fetch
  // the discovery data from. fallbackEndpoints is mostly/only relevant for Bloom
  //
  const fallbackEndpoints = ['/', '/discovery.json']; // Might only be relevant for Bloom
  const { discoveryURL } = getInitialisationParameters();

  const _handleFetchingDiscoveryURL = () => {
    authLog(`Attempting to load SSO providers from endpoint: ${discoveryURL}`);
    return fetchDiscoveryDataFromUrl(discoveryURL);
  };

  const _handleDiscoveryAPI = () => {
    authLog(`Attempting to load SSO providers from Discovery API: ${discoveryAPIurl}`);
    return fetchDiscoveryDataFromUrl(discoveryAPIurl);
  };

  const _handleFallbackDiscovery = async (urls) => {
    authLog(`Attempting to load SSO providers from fallback endpoints: ${urls}`);
    let result = { status: Success, message: Success, host: null, SSOProviders: [] };
    for (const url of urls) {
      result = await fetchDiscoveryDataFromUrl(url);
      if (result.status === Success || result.status === NoProviderError) {
        break;
      }
    }
    return result;
  };

  const _handleLocalDiscovery = async () => {
    if (!discoveryAPIurl) {
      // For Bloom: Don't pass a discoveryAPIurl if dbms < 4.4
      return _handleFallbackDiscovery(fallbackEndpoints);
    }

    let localDiscoveryData = await _handleDiscoveryAPI();
    if (!localDiscoveryData?.SSOProviders.length) {
      localDiscoveryData = await _handleFallbackDiscovery(fallbackEndpoints);
    }
    return localDiscoveryData;
  };

  const _handleDiscoveryURL = async () => {
    const discoveryURLData = await (discoveryURL
      ? _handleFetchingDiscoveryURL()
      : Promise.resolve({ SSOProviders: [] }));
    return discoveryURLData;
  };

  // Note here that the "local" discovery and the DiscoveryURL fetching run in parallel.
  const [localDiscoveryData, discoveryURLData] = await Promise.all([_handleLocalDiscovery(), _handleDiscoveryURL()]);

  const newProvidersFromLocalDiscovery = localDiscoveryData.SSOProviders.filter(
    (providerFromLocalDisc) =>
      !discoveryURLData.SSOProviders.find((provider) => providerFromLocalDisc.id === provider.id),
  );

  const mergedSSOProviders = discoveryURLData.SSOProviders.concat(newProvidersFromLocalDiscovery);
  authLog(`Discovery data yielded SSO providers with ids: ${mergedSSOProviders.map((p) => p.id).join(', ') || '-'}`);
  return mergedSSOProviders;
};

export const initializeSSO = async (ssoDiscoveryUrl, _setCredentials) => {
  const SSORedirectId = getSSOServerIdIfShouldRedirect();

  if (SSORedirectId) {
    // _setIsProcessing(true)

    authLog(`Initialised with sso_redirect value: "${SSORedirectId}"`);

    removeSearchParamsInBrowserHistory(defaultSearchParamsToRemoveAfterAutoRedirect);

    try {
      const mergedSSOProviders = await getDiscoveryDataInfo(ssoDiscoveryUrl);

      // _setIsProcessing(false)

      if (!mergedSSOProviders.length) {
        authLog('Discovery data fetching after auto-redirect failed', 'warn');
      }
      const selectedSSOProvider = mergedSSOProviders.find(({ id }) => id === SSORedirectId);
      authRequestForSSO(selectedSSOProvider);
      return true;
    } catch (error) {
      // _setIsProcessing(false)
      alert(error);
      return false;
      // TODO check if this unreachable code is still needed
      // authLog(`Discovery data after sso_redirect step erroneous. err: ${error}`, 'warn');
    }
  } else if (wasRedirectedBackFromSSOServer()) {
    // _setIsProcessing(true)
    authLog('Handling auth_flow_step redirect');
    restoreSearchAndHashParams(['connectURL', 'discoveryURL'], false);

    try {
      const mergedSSOProviders = await getDiscoveryDataInfo(ssoDiscoveryUrl);
      const credentials = await handleAuthFromRedirect(mergedSSOProviders);
      // _setIsProcessing(false)

      //
      // "Hook-in" point.
      //
      // Successful credentials retrieval.
      // Log in at the Neo4j dbms now using the Neo4j (js) driver.
      //
      _setCredentials(credentials);

      // Exemplifying retrieval of stored URL paramenters
      _retrieveAdditionalURLParameters();
      return true;
    } catch (error) {
      // _setIsProcessing(false)
      alert(error);
      authLog(`Handling auth_flow_step redirect failed. err: ${error}`, 'warn');
    }
  } else {
    return false;
  }
  return false;
};

/**
 * Neo4j Bloom uses so called deep links and the arguments (URL paramenters)
 * needed to be temporarly stored due to the redirect to the identity provider.
 * This method shall exemplify this.
 */
const _retrieveAdditionalURLParameters = () => {
  const storedDeepLinkArgs = restoreSearchAndHashParams(['search', 'perspective', 'run']);
  if (storedDeepLinkArgs) {
    // eslint-disable-next-line no-console
    console.log('Time to apply the deep link args now...');
  }
};
