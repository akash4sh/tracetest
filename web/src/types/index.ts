import { SpanAttributeType } from "../services/SpanAttributeService";

export enum TestState {
  CREATED = 'CREATED',
  EXECUTING = 'EXECUTING',
  AWAITING_TRACE = 'AWAITING_TRACE',
  AWAITING_TEST_RESULTS = 'AWAITING_TEST_RESULTS',
  FAILED = 'FAILED',
  FINISHED = 'FINISHED',
}

export enum HTTP_METHOD {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  COPY = 'COPY',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  LINK = 'LINK',
  UNLINK = 'UNLINK',
  PURGE = 'PURGE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
  PROPFIND = 'PROPFIND',
  VIEW = 'VIEW',
}

export const enum TEST_RUN_EXECUTION_STATE {
  CREATED = 'CREATED',
  EXECUTING = 'EXECUTING',
  AWAITING_TRACE = 'AWAITING_TRACE',
  FAILED = "FAILED",
  FINISHED = "FINISHED",
  AWAITING_TEST_RESULTS = "AWAITING_TEST_RESULTS",
}

export const enum LOCATION_NAME {
  RESOURCE_ATTRIBUTES = 'RESOURCE_ATTRIBUTES',
  INSTRUMENTATION_LIBRARY = 'INSTRUMENTATION_LIBRARY',
  SPAN = 'SPAN',
  SPAN_ATTRIBUTES = 'SPAN_ATTRIBUTES',
  SPAN_ID = 'SPAN_ID',
}

export const enum COMPARE_OPERATOR {
  EQUALS = 'EQUALS',
  LESSTHAN = 'LESSTHAN',
  GREATERTHAN = 'GREATERTHAN',
  NOTEQUALS = 'NOTEQUALS',
  GREATOREQUALS = 'GREATOREQUALS',
  LESSOREQUAL = 'LESSOREQUAL',
}

export type ISpanAttributeValue = {
  stringValue: string;
  intValue: number;
  booleanValue: boolean;
  doubleValue: number;
  kvlistValue: {values: ISpanAttribute[]};
};

export type ISpanAttribute = {
  key: string;
  value: ISpanAttributeValue;
};

export interface ISpan {
  traceId: string;
  spanId: string;
  name: string;
  kind: string;
  startTime: number;
  duration: number;
  attributes: ISpanAttribute[];
  events: Array<{
    timeUnixNano: string;
    name: string;
    attributes: Array<{
      key: string;
      value: {[key: string]: any};
    }>;
  }>;
}

export interface IAttribute {
  id?: string;
  key: string;
  value: string;
  type: 'span' | 'resource';
}

export interface TestRunResult {
  resultId: string;
  testId: string;
  traceId: string;
  spanId: string;
  createdAt: string;
  completedAt: string;
  response: any;
  trace: ITrace;
  state: TestState;
  assertionResultState: boolean;
  assertionResult: AssertionResultList;
}

export type AssertionResultList = Array<{
  assertionId: string;
  spanAssertionResults: spanAssertionResult[];
}>;

export interface HTTPRequest {
  url: string;
  method: HTTP_METHOD;
  headers?: Array<{[key: string]: string}>;
  body?: string;
  auth?: any;
  proxy?: any;
  certificate?: any;
}

export interface Test {
  testId: string;
  name: string;
  description: string;
  serviceUnderTest: {
    id: string;
    request: HTTPRequest;
  };
  assertions: Array<Assertion>;
  lastTestResult: TestRunResult;
}

export interface ItemSelector {
  locationName: LOCATION_NAME;
  propertyName: string;
  value: string;
  valueType: string;
}

export interface SpanSelector {
  spanAssertionId?: string;
  locationName: LOCATION_NAME;
  propertyName: string;
  valueType: SpanAttributeType;
  operator: COMPARE_OPERATOR;
  comparisonValue: string;
}
export interface Assertion {
  assertionId: string;
  selectors: Array<ItemSelector>;
  spanAssertions: Array<SpanSelector>;
}

export interface TestResult {
  id: string;
  successful: {
    id: string;
    operationName: string;
    duration: string;
    numOfSPans: number;
    attributes: Array<IAttribute>;
  };
  failed: {
    id: string;
    operationName: string;
    duration: string;
    numOfSPans: number;
    attributes: Array<IAttribute>;
  };
  timeStamp: Date;
}

export interface ITrace {
  resourceSpans: Array<ResourceSpan>;
  description: string;
}

export interface ResourceSpan {
  resource: Resource;
  instrumentationLibrarySpans: InstrumentationLibrarySpan[];
}

export interface InstrumentationLibrarySpan {
  instrumentationLibrary: InstrumentationLibrary;
  spans: Span[];
}

export interface Event {
  timeUnixNano: any;
  name: string;
  attributes: Attribute[];
}

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId: string;
  name: string;
  kind: number;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: Attribute[];
  status: {code: string};
  events: Event[];
}

export interface Resource {
  attributes: Attribute[];
}

export interface InstrumentationLibrary {
  name: string;
  version: string;
}

export interface Attribute {
  key: string;
  value: {[key: string]: string};
}

export interface spanAssertionResult {
  spanAssertionId: string;
  spanId: string;
  passed: boolean;
  observedValue: string;
}

export interface TestAssertionResult {
  assertionResultState: boolean;
  assertionResult: AssertionResultList;
}

export type TestId = string;

export type AssertionResult = {
  spanListAssertionResult: {
    span: ResourceSpan;
    resultList: SpanAssertionResult[];
  }[];
  assertion: Assertion;
};

export interface SpanAssertionResult extends SpanSelector {
  hasPassed: boolean;
  actualValue: string;
  spanId: string;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type TSpanAttributesList = {key: string; value: string}[];
