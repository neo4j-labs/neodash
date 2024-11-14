export const hasCheckboxes = (actionsRules) => {
  let rules = actionsRules.filter((rule) => rule.condition && rule.condition == 'rowCheck');
  return rules.length > 0;
};

export const getCheckboxes = (actionsRules, rows, getGlobalParameter) => {
  let rules = actionsRules.filter((rule) => rule.condition && rule.condition == 'rowCheck');
  const params = rules.map((rule) => `neodash_${rule.customizationValue}`);
  // See if any of the rows should be checked. This is the case when a parameter is already in the list of checked values.
  let selection: number[] = [];
  params.forEach((parameter, index) => {
    const fieldName = rules[index].value;
    const values = getGlobalParameter(parameter);

    // If the parameter is an array (to be expected), iterate over it to find the rows to check.
    if (Array.isArray(values)) {
      values.forEach((value) => {
        rows.forEach((row) => {
          if (row[fieldName] == value) {
            selection.push(row.id);
          }
        });
      });
    } else {
      // Else (special case), still check the row if it's a single value parameter.
      rows.forEach((row) => {
        if (row[fieldName] == values) {
          selection.push(row.id);
        }
      });
    }
  });
  return [...new Set(selection)];
};

export const updateCheckBoxes = (actionsRules, rows, selection, setGlobalParameter) => {
  if (hasCheckboxes(actionsRules)) {
    const selectedRows = rows.filter((row) => selection.includes(row.id));
    console.log(selectedRows);
    let rules = actionsRules.filter((rule) => rule.condition && rule.condition == 'rowCheck');
    rules.forEach((rule) => {
      const parameterValues = selectedRows.map((row) => row[rule.value]).filter((v) => v !== undefined);
      setGlobalParameter(`neodash_${rule.customizationValue}`, parameterValues);
      setGlobalParameter(`neodash_${rule.customizationValue}_display`, parameterValues);
    });
  }
};
