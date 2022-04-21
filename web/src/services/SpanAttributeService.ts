import {isEmpty} from 'lodash';
import {ISpanAttribute} from '../types';

export enum SpanAttributeType {
  stringValue = 'stringValue',
  intValue = 'intValue',
  booleanValue = 'booleanValue',
  doubleValue = 'doubleValue',
  kvlistValue = 'kvlistValue',
}

const spanAttributeTypeList = Object.values(SpanAttributeType);

export const getSpanAttributeValueType = (attribute: ISpanAttribute): SpanAttributeType =>
  spanAttributeTypeList.find(type => {
    const value = attribute.value[type];
    if (typeof value === 'number') return true;
    return !isEmpty(value);
  }) || SpanAttributeType.stringValue;

export const getSpanAttributeValue = (attribute: ISpanAttribute): string => {
  const attributeType = getSpanAttributeValueType(attribute);
  const value = attribute.value[attributeType];

  if (!value) return 'Empty value';
  switch (attributeType) {
    case SpanAttributeType.kvlistValue: {
      return JSON.stringify(value);
    }

    default: {
      return String(value);
    }
  }
};
