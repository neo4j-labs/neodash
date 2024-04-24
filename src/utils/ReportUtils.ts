// Components can call this to check if any extension is enabled. For example, to decide whether to all rule-based styling.
export const extensionEnabled = (extensions, name) => {
  return extensions && extensions[name] && extensions[name].active;
};

export async function validateQuery(query, driver, database) {
  /**
   * This function validates the query in input and returns True if valid, otherwise False
   */
  try {
    const toValidate = `EXPLAIN ${query}`;
    const session = driver.session({ database: database });
    const transaction = session.beginTransaction({ timeout: 20 * 1000, connectionTimeout: 2000 });
    await transaction.run(toValidate);
    return true;
  } catch (e) {
    return false;
  }
}
