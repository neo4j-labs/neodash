import StyleConfig from './StyleConfig';

export const enum Screens {
  WELCOME_SCREEN,
  CONNECTION_MODAL,
}

const styleConfig = await StyleConfig.getInstance();

export const DEFAULT_SCREEN = Screens.WELCOME_SCREEN; // WELCOME_SCREEN
export const DEFAULT_NEO4J_URL = 'localhost'; // localhost
export const DEFAULT_DASHBOARD_TITLE = ''; // ''

export const DASHBOARD_BUTTON_IMAGE = 'neo4j-icon.png'; // 'neo4j-icon.png'
export const DASHBOARD_BUTTON_IMAGE_SIZE = 64; // 32;
export const DASHBOARD_HEADER_COLOR = styleConfig?.style?.DASHBOARD_HEADER_COLOR || '#0B297D'; // '#0B297D'

export const DASHBOARD_HEADER_BUTTON_COLOR = styleConfig?.style?.DASHBOARD_HEADER_BUTTON_COLOR || '#FFFFFF22'; // '#FFFFFF22'

export const DASHBOARD_HEADER_TITLE_COLOR = styleConfig?.style?.DASHBOARD_HEADER_TITLE_COLOR || '#FFFFFF'; // '#FFFFFF'

export const DASHBOARD_PAGE_LIST_COLOR = styleConfig?.style?.DASHBOARD_PAGE_LIST_COLOR || '#f0f0f0'; // '#f0f0f0'

export const DASHBOARD_PAGE_LIST_ACTIVE_COLOR = styleConfig?.style?.DASHBOARD_PAGE_LIST_ACTIVE_COLOR || '#ffffff'; // '#FFFFFF'

export const APPLY_CUSTOM_BRAND_LOGO = styleConfig?.style?.APPLY_CUSTOM_BRAND_LOGO || false; // false
export const DASHBOARD_HEADER_BRAND_LOGO = styleConfig?.style?.DASHBOARD_HEADER_BRAND_LOGO || 'logo.png';

export const CUSTOM_CONNECTION_FOOTER_TEXT = ''; // ''
