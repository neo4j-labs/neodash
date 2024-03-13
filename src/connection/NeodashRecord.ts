export class NeodashRecord {
  keys: string[];

  _fields: any[];

  _fieldsLookup: Record<string, number>;

  dict: Record<string, any>;

  constructor(keys, fields) {
    this.keys = keys;
    this._fields = fields;
    this.dict = this.toDict();
    this._fieldsLookup = this._setFieldLookup();
  }

  toDict() {
    return Object.fromEntries(this.keys.map((e, i) => [e, this._fields[i]]));
  }

  get(key: string) {
    return this.dict[key];
  }

  _setFieldLookup() {
    let res = {};
    this._fields.map((fld, idx) => {
      res[fld] = idx;
    });
    return res;
  }
}
