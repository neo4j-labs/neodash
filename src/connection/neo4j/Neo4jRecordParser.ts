import { isDate, isDateTime, isLocalDateTime } from 'neo4j-driver-core';
import { NeodashRecordParser } from '../NeodashRecordParser';
import { isInt } from 'neo4j-driver-core/lib/integer.js';
import { NeodashRecord } from '../NeodashRecord';
import Record from 'neo4j-driver-core/lib/record.js';
import { isNode, isPath } from 'neo4j-driver-core/lib/graph-types.js';
import { Date as Neo4jDate, Integer } from 'neo4j-driver';

export class Neo4jRecordParser extends NeodashRecordParser {
  parse(record: Record): NeodashRecord {
    if (record.error) {
      return record;
    }
    let { keys } = record;
    let fields = record._fields.map((f) => this.fieldToNative(f));
    return new NeodashRecord(keys, fields);
  }

  fieldToNative(input: any): any {
    if (!input && input !== false) {
      return null;
    } else if (this.isNumber(input)) {
      return this.toNumber(input);
    } else if (Array.isArray(input)) {
      return (input as Array<any>).map((item) => this.fieldToNative(item));
    } else if (this.isDate(input)) {
      return this.toDate(input);
    } else if (typeof input === 'object') {
      const converted = Object.entries(input).map(([key, value]) => [key, this.fieldToNative(value)]);
      return Object.fromEntries(converted);
    }
    return input;
  }

  isNumber(value): boolean {
    if (typeof value === 'number') {
      return true;
    }
    if (isInt(value)) {
      return true;
    }
    return false;
  }

  toNumber(value: any): number {
    return Integer.toNumber(value);
  }

  toString(value: any): string {
    return value.toString();
  }

  isDate(value: any): boolean {
    return isDate(value) || isDateTime(value) || isLocalDateTime(value);
  }

  toDate(value: Neo4jDate): Date {
    return value.toStandardDate();
  }

  isNeo4jNode(value: any): boolean {
    return isNode(value);
  }

  isNeo4jPath(value: any): boolean {
    return isPath(value);
  }
}
