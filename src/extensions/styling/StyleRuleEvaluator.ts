import { makeStyles } from '@mui/styles';
import { EntityType } from '../../chart/Utils';

/**
 * Evaluates the specified rule set on a row returned by the Neo4j driver.
 * @param record - a single result row produced by the Neo4j driver.
 * @param customization - the target customization (e.g. "text color")
 * @param defaultValue - the value to default to if no rules are met.
 * @param rules - a list of rules as produced by the rule-based styling screen.
 * @returns a user-defined value if a rule is met, or the default value if none are.
 */
export const evaluateRulesOnNeo4jRecord = (record, customization, defaultValue, rules) => {
  if (!record || !customization || !rules) {
    return defaultValue;
  }
  for (const [index, rule] of rules.entries()) {
    // Only look at rules relevant to the target customization.
    if (rule.customization == customization) {
      // if the row contains the specified field...
      if (record._fieldLookup[rule.field] !== undefined) {
        const val = record._fields[record._fieldLookup[rule.field]];
        const realValue = val && val.low ? val.low : val;
        const ruleValue = rule.value;
        if (evaluateCondition(realValue, rule.condition, ruleValue)) {
          return rule.customizationValue;
        }
      }
    }
  }
  // If the rules have determined a value, return it, otherwise, return the default.
  return defaultValue;
};

/**
 * @deprecated - to be removed together with record mapper.
 * We translate the 'mapped' record back into its original using the mapping specified by the user.
 */
// TODO this function is no longer needed as the record mapper is gone since 2.2.
export const evaluateRulesOnMappedNeo4jRecord = (record, mapping, customization, defaultValue, rules) => {
  const tempRecord = {};

  tempRecord._fields = record._fields;
  tempRecord._fieldLookup = {};
  tempRecord._fieldLookup[mapping.index] = record._fieldLookup.index;
  tempRecord._fieldLookup[mapping.value] = record._fieldLookup.value;
  tempRecord._fieldLookup[mapping.key] = record._fieldLookup.key;
  tempRecord.keys = Object.values(mapping);
  return evaluateRulesOnNeo4jRecord(tempRecord, customization, defaultValue, rules);
};

/**
 * Evaluates the specified rule set on a dictionary of key/value pairs.
 * Returns the `index` of the rule that is satisfied.
 *
 * @param dict - a dictionary of key/value pairs.
 * @param rules - a list of rules as produced by the rule-based styling screen.
 * @param customizations - a list of customizations to look for.
 * @returns the index of the rule that is satisfied.
 */
export const evaluateRulesOnDict = (dict, rules, customizations) => {
  if (!dict || !rules) {
    return -1;
  }
  for (const [index, rule] of rules.entries()) {
    // Only check customizations that are specified
    return evaluateSingleRuleOnDict (dict, rule, index, customizations)
  }
  // If no rules are met, return not found (index=-1)
  return -1;
};

export const evaluateSingleRuleOnDict = (dict, rule, ruleIndex, customizations) => {
  if (customizations.includes(rule.customization)) {
    // if the row contains the specified field...
    if (dict[rule.field] !== undefined && dict[rule.field] !== null) {
      const realValue = dict[rule.field].low ? dict[rule.field].low : dict[rule.field];
      const ruleValue = rule.value;
      if (evaluateCondition(realValue, rule.condition, ruleValue)) {
        return ruleIndex;
      }
    }
  }
  return -1;
}


/**
 *  Evaluates the specified rule set on a node object returned by the Neo4j driver.
 * @param node - the node representation returned by the Neo4j driver.
 * @param customization - the target customization (e.g. "node label color")
 * @param defaultValue - the value to default to if no rules are met.
 * @param rules - a list of rules as produced by the rule-based styling screen.
 * @returns a user-defined value if a rule is met, or the default value if none are.
 */
export const evaluateRulesOnNode = (node, customization, defaultValue, rules) => {
  return evaluateRules(node, customization, defaultValue, rules, EntityType.Node);
};

export const evaluateRulesOnLink = (link, customization, defaultValue, rules) => {
  return evaluateRules(link, customization, defaultValue, rules, EntityType.Relationship);
};

export const evaluateRules = (entity, customization, defaultValue, rules, entityType) => {
  if (!entity || !customization || !rules) {
    return defaultValue;
  }

  for (const [index, rule] of rules.entries()) {
    // Only look at rules relevant to the target customization.
    if (rule.customization == customization) {
      // if the row contains the specified field...
      const typeOrLabel = rule.field.split('.')[0];
      const property = rule.field.split('.')[1];

      if (
        (entityType === EntityType.Node && entity.labels.includes(typeOrLabel)) ||
        (entityType === EntityType.Relationship && entity.type == typeOrLabel)
      ) {
        const realValue = entity?.properties?.[property] || '';
        const ruleValue = rule.value;
        if (evaluateCondition(realValue, rule.condition, ruleValue)) {
          return rule.customizationValue;
        }
      }
    }
  }
  return defaultValue;
};

/**
 * @param realValue the value found in the real data returned by the query
 * @param condition the condition, one of [=,!=,<,<=,>,>=,contains].
 * @param ruleValue the value specified in the rule.
 * @return whether the condition is met.
 */
const evaluateCondition = (realValue, condition, ruleValue) => {
  if (!ruleValue || !condition || !realValue) {
    // If something is null, rules are never met.
    return false;
  }
  if (condition == '=') {
    return realValue === ruleValue;
  }
  if (condition == '!=') {
    return realValue !== ruleValue;
  }
  if (!isNaN(Number(ruleValue))) {
    ruleValue = Number(ruleValue);
  }
  if (condition == '<=') {
    return realValue <= ruleValue;
  }
  if (condition == '<') {
    return realValue < ruleValue;
  }
  if (condition == '>=') {
    return realValue >= ruleValue;
  }
  if (condition == '>') {
    return realValue > ruleValue;
  }
  if (condition == 'contains') {
    return realValue.toString().includes(ruleValue.toString());
  }
  return false;
};

/**
 * Uses the mui `makeStyles` functionality to generate classes for each of the rules.
 * This is used for styling table rows and columns.
 */
export const generateClassDefinitionsBasedOnRules = (rules) => {
  const classes = {};
  rules.forEach((rule, i) => {
    if (rule.customization == 'cell color') {
      classes[`& .rule${i}`] = {
        backgroundColor: rule.customizationValue,
      };
    }
    if (rule.customization == 'cell text color') {
      classes[`& .rule${i}`] = {
        color: rule.customizationValue,
        fontWeight: 'bold',
      };
    }
    if (rule.customization == 'row color') {
      classes[`& .rule${i}`] = {
        backgroundColor: rule.customizationValue,
      };
    }
    if (rule.customization == 'row text color') {
      classes[`& .rule${i}`] = {
        color: rule.customizationValue,
        fontWeight: 'bold',
      };
    }
  });
  return makeStyles({
    root: classes,
  });
};

export const identifyStyleRuleParameters = (rules) => {
  return rules.reduce((acc, rule) => {
    if (rule.value.startsWith('$neodash_')) {
      acc.push(rule.value.substring(1).trim());
    }
    return acc;
  }, []);
};

export const styleRulesReplaceParams = (rules, getGlobalParameter) => {
  return rules.reduce((acc, rule) => {
    let r = Object.assign({}, rule);
    if (r.value.startsWith('$neodash_')) {
      r.value = getGlobalParameter(r.value.substring(1).trim())
        ? getGlobalParameter(r.value.substring(1).trim())
        : r.value;
    }
    acc.push(r);
    return acc;
  }, []);
};

export function useStyleRules(enabled, rules, callback) {
  if (!enabled || !rules) {
    return [];
  }
  const styleParamsCalc = identifyStyleRuleParameters(rules);
  let styleRules = styleParamsCalc;
  styleRules = styleRulesReplaceParams(rules, callback);

  return styleRules;
}
