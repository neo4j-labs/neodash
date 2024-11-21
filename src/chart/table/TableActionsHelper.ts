export const hasCheckboxes = (actionsRules) => {
  let rules = actionsRules.filter((rule) => rule.condition && rule.condition == 'rowCheck');
  return rules.length > 0;
};

export const hasPreCondition = (preConditions) => {
  return preConditions.length > 0;
};

const groupConditionsByField = (conditions) => {
  return conditions.reduce((acc, condition) => {
    if (!acc[condition.field]) {
      acc[condition.field] = [];
    }
    acc[condition.field].push(condition);
    return acc;
  }, {});
};

const evaluateGroupedConditions = (groupedConditions, row) => {
  return Object.keys(groupedConditions).every((field) => {
    // Logical OR between conditions for the same field
    return groupedConditions[field].some((condition) => evaluateCondition(condition, row));
  });
};

export const convertConditionsToExpression = (conditions, row) => {
  const groupedConditions = groupConditionsByField(conditions);
  return !evaluateGroupedConditions(groupedConditions, row);
};

const evaluateCondition = (condition, row) => {
  const fieldValue = row[condition.field];
  switch (condition.condition) {
    case '=':
      return fieldValue === condition.value;
    case '!=':
      return fieldValue !== condition.value;
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
    case 'not_contains':
      return typeof fieldValue === 'string' && !fieldValue.includes(condition.value);
    default:
      return false;
  }
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
        rows.forEach((row, index) => {
          if (row[fieldName] == value) {
            selection.push(index);
          }
        });
      });
    } else {
      // Else (special case), still check the row if it's a single value parameter.
      rows.forEach((row, index) => {
        if (row[fieldName] == values) {
          selection.push(index);
        }
      });
    }
  });
  return [...new Set(selection)];
};

export const updateCheckBoxes = (actionsRules, rows, selection, setGlobalParameter) => {
  if (hasCheckboxes(actionsRules)) {
    const selectedRows = rows.filter((_, i) => selection.includes(i));
    let rules = actionsRules.filter((rule) => rule.condition && rule.condition == 'rowCheck');
    rules.forEach((rule) => {
      const parameterValues = selectedRows.map((row) => row[rule.value]).filter((v) => v !== undefined);
      setGlobalParameter(`neodash_${rule.customizationValue}`, parameterValues);
      setGlobalParameter(`neodash_${rule.customizationValue}_display`, parameterValues);
    });
  }
};
