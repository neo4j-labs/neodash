import { extensionEnabled, getReportTypes } from '../extensions/ExtensionUtils';
import { useStyleRules } from '../extensions/styling/StyleRuleEvaluator';

/**
 * Gets the user specified settings and merges it with the defaults from ReportConfig.tsx.
 * @param userSettings the user specified settings for the report.
 * @param extensions the extensions enabled for the dashboard.
 * @param getGlobalParameter a callback to get global parameters for the dashboard.
 * @returns  a merged list of user settings and defaults as provided in the configuration.
 */
export const getSettings = (
  userSettings: Record<string, any> | undefined,
  extensions: Record<string, any> | undefined,
  getGlobalParameter: any
) => {
  const settings: Record<string, any> = {};
  const config: Record<string, any> = getReportTypes(extensions).graph.settings;

  if (userSettings == undefined) {
    return {};
  }

  Object.keys(config).map((key) => {
    settings[key] = userSettings[key] !== undefined ? userSettings[key] : config[key].default;
  });

  settings.styleRules = useStyleRules(
    extensionEnabled(extensions, 'styling'),
    userSettings && userSettings.styleRules,
    getGlobalParameter
  );

  return settings;
};
