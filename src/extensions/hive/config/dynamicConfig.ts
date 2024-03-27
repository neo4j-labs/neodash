/* eslint require-atomic-updates: 0 */
let solutionsConfig = null;

export const configAsync = async (envKey) => {
  if (!solutionsConfig) {
    await loadConfig();
  }
  return config(envKey);
};

export const config = (envKey) => {
  if (!solutionsConfig) {
    throw new Error('loadConfig must be called before calling config');
  }

  if (!solutionsConfig.extensions || !solutionsConfig.extensions.solutionsHive) {
    throw new Error('expected extensions.solutionsHive key');
  }

  return solutionsConfig.extensions.solutionsHive[envKey];
};

export const loadConfig = async (configJson) => {
  if (!solutionsConfig) {
    try {
      if (configJson) {
        solutionsConfig = configJson;
      } else {
        let response = await fetch('config.json');
        solutionsConfig = await response.json();
      }
    } catch (e) {
      solutionsConfig = null;
      // eslint-disable-next-line no-console
      console.log('error during loadConfig: ', e);
      throw new Error('config.json must be configured and must have an extensions.solutionsHive key');
    }
  }
};
