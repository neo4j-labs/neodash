export default class StyleConfig {
  private static instance: StyleConfig;

  protected style: any;

  private constructor() {}

  public static async getInstance(): StyleConfig {
    if (!this.instance) {
      this.instance = await this.create();
    }
    return this.instance;
  }

  async initialize() {
    await (await fetch('style.config.json')).json().then((json) => {
      this.style = json;
    });
  }

  static async create() {
    const o = new StyleConfig();
    await o.initialize();
    return o;
  }
}
