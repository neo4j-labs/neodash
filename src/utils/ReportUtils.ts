// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions && extensions[name] && extensions[name].active;
};


export const dottedTruncateString = (str) => (str.length > 25 ? `${str.slice(0, 25)}...` : str);