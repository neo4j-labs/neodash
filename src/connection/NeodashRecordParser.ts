import { NeodashRecord } from './NeodashRecord';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export abstract class NeodashRecordParser {
  bulkParse(records: any[]): NeodashRecord[] {
    return records.map((record) => this.parse(record));
  }

  parse(_record: any): NeodashRecord {
    return notImplementedError('parse');
  }

  toNumber(_value: any): number {
    return notImplementedError('toNumber');
  }

  toString(_value: any): string {
    return notImplementedError('toString');
  }

  toDate(_value: any): Date {
    return notImplementedError('toDate');
  }
}
