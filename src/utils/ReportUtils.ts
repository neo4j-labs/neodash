// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions && extensions[name] && extensions[name].active;
};

export const dottedTruncateString = (str: string, len: number) => (str.length > len ? `${str.slice(0, len)}...` : str);