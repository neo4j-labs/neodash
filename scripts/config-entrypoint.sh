#!/bin/sh
###########
set -e 

echo " \
    { \
    \"ssoEnabled\": ${ssoEnabled:=false}, \
    \"ssoProviders\": ${ssoProviders:=[]}, \
    \"ssoDiscoveryUrl\": \"${ssoDiscoveryUrl:='https://example.com'}\",  \
    \"standalone\": ${standalone:=false}, \
    \"standaloneProtocol\": \"${standaloneProtocol:='neo4j+s'}\", \
    \"standaloneHost\": \"${standaloneHost:='test.databases.neo4j.io'}\", \
    \"standalonePort\": ${standalonePort:=7687}, \
    \"standaloneDatabase\": \"${standaloneDatabase:='neo4j'}\",  \
    \"standaloneUsername\": \"${standaloneUsername:=}\", \
    \"standalonePassword\": \"${standalonePassword:=}\", \
    \"standaloneDashboardName\": \"${standaloneDashboardName:='My Dashboard'}\", \
    \"standaloneDashboardDatabase\": \"${standaloneDashboardDatabase:='neo4j'}\",  \
    \"standaloneDashboardURL\": \"${standaloneDashboardURL:=}\",  \
    \"standaloneAllowLoad\": ${standaloneAllowLoad:=false},  \
    \"standaloneLoadFromOtherDatabases\": ${standaloneLoadFromOtherDatabases:=false},  \
    \"standaloneMultiDatabase\": ${standaloneMultiDatabase:=false}, \
    \"standaloneDatabaseList\": \"${standaloneDatabaseList:='neo4j'}\", \
    \"standalonePasswordWarningHidden\": ${standalonePasswordWarningHidden:=false},  \
    \"loggingMode\": \"${loggingMode:='0'}\",  \
    \"loggingDatabase\": \"${loggingDatabase:='logs'}\",  \
    \"customHeader\": \"${customHeader:=}\"  \
   }" > /usr/share/nginx/html/config.json

echo " \
  { \
  \"DASHBOARD_HEADER_BRAND_LOGO\": \"${DASHBOARD_HEADER_BRAND_LOGO:=}\",  \
  \"DASHBOARD_HEADER_COLOR\" : \"${DASHBOARD_HEADER_COLOR:=}\",  \
  \"DASHBOARD_HEADER_BUTTON_COLOR\" : \"${DASHBOARD_HEADER_BUTTON_COLOR:=}\",  \
  \"DASHBOARD_HEADER_TITLE_COLOR\" : \"${DASHBOARD_HEADER_TITLE_COLOR:=}\",  \
  \"DASHBOARD_PAGE_LIST_COLOR\" : \"${DASHBOARD_PAGE_LIST_COLOR:=}\", \
  \"DASHBOARD_PAGE_LIST_ACTIVE_COLOR\": \"${DASHBOARD_PAGE_LIST_ACTIVE_COLOR:=}\", \
  \"style\": { \
    \"--palette-light-neutral-bg-weak\": \"${STYLE_PALETTE_LIGHT_NEUTRAL_BG_WEAK:=}\" \
  } \
}" > /usr/share/nginx/html/style.config.json


