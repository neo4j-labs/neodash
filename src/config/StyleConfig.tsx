export default class StyleConfig {
  private static instance: StyleConfig;

  protected style: any;

  private constructor() {}

  public static async getInstance(): Promise<StyleConfig> {
    if (!this.instance) {
      this.instance = await this.create();
    }
    return this.instance;
  }

  async initialize() {
    try {
      await (await fetch('style.config.json')).json().then((json) => {
        this.style = json;
      });
    } catch (e) {
      this.style = {};
    }
  }

  static async create() {
    const o = new StyleConfig();
    await o.initialize();
    return o;
  }

  public applyCSS() {
    const rules = this.style?.style || {};
    for (const [key, value] of Object.entries(rules)) {
      document.documentElement.style.setProperty(key, value);
    }
  }
}
