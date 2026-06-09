import type {ReactNode} from 'react';

import type {UnipikaFlattenTreeJoinedPath, UnipikaFlattenTreeItem} from '../utils/flattenUnipika';

export type UnipikaSettings = {
    nonBreakingIndent?: boolean;
    escapeWhitespace?: boolean;
    escapeYQLStrings?: boolean;
    binaryAsHex?: boolean;
    showDecoded?: boolean;
    decodeUTF8?: boolean;
    format?: string;
    indent?: number;
    compact?: boolean;
    asHTML?: boolean;
    break?: boolean;
    maxListSize?: number;
    maxStringSize?: number;
    omitStructNull?: boolean;
    treatValAsData?: boolean;
    validateSrcUrl?: (taggedTypeUrl: string) => boolean;
    normalizeUrl?: (url?: string) => string;
};

export type CollapseIconType = 'chevron';

export interface ToolbarProps {
    filter: string;
    matchIndex: number;
    matchedRows: Array<number>;
    allMatchPaths: Array<UnipikaFlattenTreeJoinedPath>;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    onFilterChange: (filter: string) => void;
    onNextMatch: (event: unknown, diff?: number) => void;
    onPrevMatch: () => void;
    onEnterKeyDown: (e: React.KeyboardEvent) => void;
    isCollapsed: boolean;
}

interface BaseUnipikaValue {
    $attributes?: UnipikaMap['$value'];
}

export interface UnipikaMap extends BaseUnipikaValue {
    $type: 'map';
    $value: Array<[UnipikaMapKey, UnipikaValue]>;
}

interface UnipikaType<Type, Value> extends BaseUnipikaValue {
    $type: Type;
    $value: Value;
}

export interface UnipikaMapKey extends BaseUnipikaValue {
    $key: true;
    $type: 'string';
    $value: string;
    $decoded_value?: string;
}

export interface UnipikaList extends BaseUnipikaValue {
    $type: 'list';
    $value: Array<UnipikaValue>;
}

type UnipikaString = UnipikaType<'string', string> & {
    $decoded_value?: string;
};

/**
 * Actually there might be another primitive types but at this level
 * it is enought to know that there are specific interfaces for 'map', 'list' and 'string',
 * and similar structure for all rest types.
 */
type UnipikaRestPrimitive = UnipikaType<
    'null' | 'boolean' | 'number' | 'double' | 'int64',
    string | number | boolean | null
>;

export type UnipikaPrimitive = UnipikaString | UnipikaRestPrimitive;

export interface UnipikaYqlList extends BaseUnipikaValue {
    $type: 'yql.list' | 'yql.stream' | 'yql.tuple' | 'yql.set';
    $value: Array<UnipikaValue>;
}

export interface UnipikaYqlMap extends BaseUnipikaValue {
    $type: 'yql.struct' | 'yql.dict' | 'yql.variant';
    $value: Array<[UnipikaMapKey, UnipikaValue]>;
}

export type UnipikaMapLike = UnipikaMap | UnipikaYqlMap;

export type UnipikaListLike = UnipikaList | UnipikaYqlList;

export type UnipikaContainer = UnipikaMapLike | UnipikaListLike;

export type UnipikaValue = UnipikaContainer | UnipikaPrimitive;

export type RenderRowExtraToolsParams = Pick<UnipikaFlattenTreeItem, 'path' | 'value'>;

export type RenderRowExtraTools = (params: RenderRowExtraToolsParams) => ReactNode;
