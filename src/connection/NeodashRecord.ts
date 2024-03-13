export class NeodashRecord {
  keys: string[];

  fields: any[];

  dict: Record<string, any>;

  constructor(keys, fields) {
    this.keys = keys;
    this.fields = fields;
    this.dict = this.toDict();
  }

  toDict() {
    return Object.fromEntries(this.keys.map((e, i) => [e, this.fields[i]]));
  }

  get(key: string) {
    return this.dict[key];
  }
}
