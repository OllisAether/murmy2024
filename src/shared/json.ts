export type JsonContent = null | boolean | number | string | JsonArray | JsonMap | undefined;

export interface JsonArray extends Array<JsonContent> {}
export interface JsonMap extends Record<string, JsonContent> {}
