const initRDKit = (() => {
  let rdkitLoadingPromise;

  return () => {
    /**
     * Utility function ensuring there's only one call made to load RDKit
     * It returns a promise with the resolved RDKit API as value on success,
     * and a rejected promise with the error on failure.
     *
     * The RDKit API is also attached to the global object on successful load.
     */
    if (!rdkitLoadingPromise) {
      rdkitLoadingPromise = new Promise((resolve, reject) => {
        window
          .initRDKitModule()
          .then((RDKit) => {
            window.RDKit = RDKit;
            resolve(RDKit);
          })
          .catch((e) => {
            reject();
          });
      });
    }

    return rdkitLoadingPromise;
  };
})();

export default initRDKit;