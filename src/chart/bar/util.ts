/**
 * Utility function to reverse engineer, from an event on a Nivo bar chart, what the original Neo4j record was the data came from.
 * Once we have this record, we can pass it to the action rule handler, so that users can define report actions on any variable
 * in their return statement.
 * @param e the click event on the bar chart.
 * @param records the Neo4j records used to build the visualization
 * @param selection the selection made by the user (category, index, group*) - where group is optional.
 * @returns
 */
export function getOriginalRecordForNivoClickEvent(e, records, selection) {
  // TODO - rewrite this to be more optimal (using list comprehensions, etc.)
  const usesGroups = Object.keys(e.data).length > 2;
  const group = e.id;
  const { value } = e;
  const category = e.indexValue;

  // Go through all records and find the first record `r` where the event's values match exactly.
  for (const i in records) {
    const r = records[i];
    const categoryIndex = r._fieldLookup[selection.index];
    const groupIndex = r._fieldLookup[selection.key];
    const valueIndex = r._fieldLookup[selection.value];
    const recordCategory = r._fields[categoryIndex];
    const recordGroup = r._fields[groupIndex];
    const recordValue = r._fields[valueIndex];

    if (usesGroups) {
      if (recordCategory == category && recordGroup == group && recordValue == value) {
        const dict = {};
        for (const i in Object.keys(r._fieldLookup)) {
          const key = Object.keys(r._fieldLookup)[i];
          dict[key] = r._fields[r._fieldLookup[key]];
        }
        return dict;
      }
    } else if (recordCategory == category && recordValue == value) {
      const dict = {};
      for (const i in Object.keys(r._fieldLookup)) {
        const key = Object.keys(r._fieldLookup)[i];
        dict[key] = r._fields[r._fieldLookup[key]];
      }
      return dict;
    }
  }
}
