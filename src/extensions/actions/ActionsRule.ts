export function actionRule(rule, e, setGlobalParameter) {
  if (rule !== null && rule.customization == 'set variable' && setGlobalParameter) {
    // call thunk for $neodash_customizationValue
    if (rule.value != '' && e.row && e.row[rule.value]) {
      setGlobalParameter(`neodash_${rule.customizationValue}`, e.row[rule.value]);
    } else if (rule.value != '' && e.properties && e.properties[rule.value]) {
      setGlobalParameter(`neodash_${rule.customizationValue}`, e.properties[rule.value]);
    } else {
      setGlobalParameter(`neodash_${rule.customizationValue}`, e.value);
    }
  }
}
