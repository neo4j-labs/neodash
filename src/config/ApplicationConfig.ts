export const enum Screens {
  WELCOME_SCREEN,
  CONNECTION_MODAL,
}

export const DEFAULT_SCREEN = Screens.CONNECTION_MODAL; // WELCOME_SCREEN
export const DEFAULT_NEO4J_URL = 'dev-kg-who-ewaa.graphapp.io'; // localhost
export const DEFAULT_DASHBOARD_TITLE = 'Anomaly Detection for Public Health Intelligence'; // ''

export const DASHBOARD_BUTTON_IMAGE = 'logo-small.png'; // 'neo4j-icon.png'
export const DASHBOARD_BUTTON_IMAGE_SIZE = 40; // 32;
export const DASHBOARD_HEADER_COLOR = '#008dc9'; // '#0B297D'
export const APPLY_CUSTOM_BRAND_LOGO = true; // false
export const DASHBOARD_HEADER_BRAND_LOGO = 'logo.png';

export const CUSTOM_CONNECTION_FOOTER_TEXT =
  'Enter your database credentials to connect to Neo4j, and load a dashboard.'; // ''
