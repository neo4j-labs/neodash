export const EXTENSIONS_HIVE = 'EXTENSIONS/HIVE';
export const updateHiveInformation = (key: string, value: any) => ({
  type: EXTENSIONS_HIVE,
  payload: { key, value },
});
