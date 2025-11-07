import React from 'react';
import {Button, Icon} from '@gravity-ui/uikit';

// @ts-ignore
import unipika from '@gravity-ui/unipika/lib/unipika';

import {ArrowUpRightFromSquare, ChevronUp, ChevronRight} from '@gravity-ui/icons';

import {CollapseIconType, UnipikaSettings} from './types';
import {BlockType, SearchInfo, UnipikaFlattenTreeItem} from '../utils/flattenUnipika';

import {MultiHighlightedText, MultiHighlightedTextProps} from '../HighlightedText/HighlightedText';
import {ClickableText} from '../ClickableText/ClickableText';

import {cn} from '../utils/classname';

import i18n from './i18n';

import './Cell.scss';

const block = cn('g-ru-cell');

export interface CellProps {
    matched: SearchInfo;
    row: UnipikaFlattenTreeItem;
    yson: boolean;
    settings: UnipikaSettings;
    collapsedState?: {readonly [key: string]: boolean};
    onToggleCollapse: (path: string) => void;
    filter?: string;
    index: number;
    showFullText: (index: number) => void;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
}

export const JSON_VALUE_KEY = {
    $key: true as true,
    $special_key: true,
    $value: '$value',
    $type: 'string' as 'string',
    $decoded_value: '$value',
};

export const JSON_ATTRIBUTES_KEY = {
    $key: true as true,
    $special_key: true,
    $value: '$attributes',
    $type: 'string' as 'string',
    $decoded_value: '$attributes',
};

const OFFSETS_BY_LEVEL: {[key: number]: React.ReactNode} = {};

function getLevelOffsetSpaces(level: number) {
    let res = OFFSETS_BY_LEVEL[level];
    if (!res) {
        const __html = Array(level * 4)
            .fill('&nbsp;')
            .join('');
        res = OFFSETS_BY_LEVEL[level] = <span dangerouslySetInnerHTML={{__html}} />;
    }
    return res;
}

export function Cell(props: CellProps) {
    const {
        row: {
            level,
            open,
            close,
            key,
            value,
            hasDelimiter,
            path,
            collapsed,
            isAfterAttributes,
            depth,
        },
        settings,
        yson,
        onToggleCollapse,
        matched,
        filter,
        showFullText,
        index,
        collapseIconType,
    } = props;

    const handleToggleCollapse = React.useCallback(() => {
        if (!path) {
            return;
        }
        onToggleCollapse(path);
    }, [path, onToggleCollapse]);

    const handleShowFullText = React.useCallback(() => {
        showFullText(index);
    }, [showFullText, index]);

    return (
        <div className={block(null, 'unipika')}>
            {getLevelOffsetSpaces(level)}
            {path && (
                <ToggleCollapseButton
                    collapsed={collapsed}
                    path={path}
                    onToggle={handleToggleCollapse}
                    collapseIconType={collapseIconType}
                />
            )}
            <Key
                text={key}
                settings={settings}
                yson={yson}
                matched={matched?.keyMatch}
                filter={filter}
                isAfterAttributes={isAfterAttributes}
            />
            {open && <OpenClose type={open} yson={yson} settings={settings} />}
            {props.showContainerSize && depth !== undefined && (
                <span className={'unipika'}>{i18n('context_items-count', {count: depth})}</span>
            )}
            {value !== undefined && (
                <Value
                    text={value}
                    settings={settings}
                    yson={yson}
                    matched={matched?.valueMatch}
                    filter={filter}
                    showFullText={handleShowFullText}
                />
            )}
            {collapsed && depth === undefined && <span className={'unipika'}>...</span>}
            {close && <OpenClose type={close} yson={yson} settings={settings} close />}
            {hasDelimiter && <SlaveText text={yson ? ';' : ','} />}
        </div>
    );
}

interface KeyProps {
    text: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'];
    yson?: boolean;
    settings: UnipikaSettings;
    isAfterAttributes?: boolean;
    filter?: string;
    matched?: Array<number>;
}

function Key(props: KeyProps) {
    const {yson} = props;
    const text: React.ReactNode = renderKeyWithFilter(props);
    if (!text) {
        return null;
    }
    return (
        <React.Fragment>
            {text}
            <SlaveText text={yson ? ' = ' : ': '} />
        </React.Fragment>
    );
}

interface ValueProps extends KeyProps {
    showFullText?: () => void;
}

function Value(props: ValueProps) {
    return <>{renderValueWithFilter(props, block('value', {type: props.text?.$type}))}</>;
}

export function asModifier(path = '') {
    return path.replace(/[^-\w\d]/g, '_');
}

function renderValueWithFilter(props: ValueProps, className: string) {
    if ('string' === props.text?.$type) {
        return renderStringWithFilter(props, className, 100);
    }
    return renderWithFilter(props, block('value'));
}

export function FilteredText({
    className,
    ...props
}: Omit<MultiHighlightedTextProps, 'classNameHighlighted'>) {
    return (
        <MultiHighlightedText
            {...props}
            className={block('filtered', className)}
            classNameHighlighted={block('filtered', {highlighted: true}, className)}
        />
    );
}

function renderStringWithFilter(props: ValueProps, className: string, maxWidth = Infinity) {
    const {text, settings, matched = [], filter, showFullText} = props;
    const tmp = unipika.format(text, {...settings, asHTML: false});
    const visible = tmp.substr(1, Math.min(tmp.length - 2, maxWidth));
    const truncated = visible.length < tmp.length - 2;
    let hasHiddenMatch = false;
    if (truncated) {
        for (let i = matched.length - 1; i >= 0; --i) {
            if (visible.length < matched[i] + (filter?.length || 0)) {
                hasHiddenMatch = true;
                break;
            }
        }
    }
    return (
        <span>
            &quot;
            <FilteredText
                className={className}
                text={visible}
                starts={matched}
                length={filter?.length}
            />
            {truncated && (
                <ClickableText
                    className={block('filtered', {
                        highlighted: hasHiddenMatch,
                    })}
                    onClick={showFullText}
                >
                    {'\u2026'}
                    <Icon data={ArrowUpRightFromSquare} />
                </ClickableText>
            )}
            &quot;
        </span>
    );
}

function renderKeyWithFilter(props: KeyProps) {
    const {yson, isAfterAttributes, settings} = props;
    if (!yson && isAfterAttributes) {
        return formatValue(JSON_VALUE_KEY, settings);
    }

    if (!props?.text) {
        return null;
    }
    return renderStringWithFilter(props, block('key'));
}

function renderWithFilter(props: KeyProps, className: string) {
    const {text, filter, yson, isAfterAttributes, settings, matched} = props;
    let res: React.ReactNode = null;
    if (matched && filter) {
        const tmp = unipika.format(text, {...settings, asHTML: false});
        res = (
            <FilteredText
                className={block('filtered', className)}
                text={tmp}
                starts={matched}
                length={filter?.length}
            />
        );
    } else {
        res = text
            ? formatValue(text, settings)
            : !yson && isAfterAttributes && formatValue(JSON_VALUE_KEY, settings);
    }
    return res ? res : null;
}

function SlaveText({text}: {text: string}) {
    return <span className={''}>{text}</span>;
}

function OpenClose(props: {
    type: BlockType;
    yson: boolean;
    close?: boolean;
    settings: UnipikaSettings;
}) {
    const {type, yson, close, settings} = props;
    switch (type) {
        case 'array':
            return <SlaveText text={close ? ']' : '['} />;
        case 'object':
            return <SlaveText text={close ? '}' : '{'} />;
        case 'attributes':
            if (yson) {
                return <SlaveText text={close ? '>' : '<'} />;
            } else {
                return (
                    <React.Fragment>
                        {close ? (
                            <SlaveText text={'}'} />
                        ) : (
                            <React.Fragment>
                                <Key text={JSON_ATTRIBUTES_KEY} settings={settings} />
                                <SlaveText text={'{'} />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                );
            }
        case 'attributes-value':
            return <SlaveText text={close ? '}' : '{'} />;
    }
}

interface ToggleCollapseProps {
    collapsed?: boolean;
    path?: UnipikaFlattenTreeItem['path'];
    onToggle: () => void;
    collapseIconType?: CollapseIconType;
}

function ToggleCollapseButton(props: ToggleCollapseProps) {
    const {collapsed, onToggle, path, collapseIconType} = props;

    // Function to render the appropriate collapse indicator based on type
    const renderCollapseIndicator = () => {
        switch (collapseIconType) {
            case 'chevron':
                return <Icon className={'unipika'} data={collapsed ? ChevronRight : ChevronUp} />;
            // Future icon types can be added here as new cases
            default:
                return <span className={'unipika'}>{collapsed ? '[+]' : '[-]'}</span>;
        }
    };

    return (
        <span title={path} className={block('collapse')}>
            <Button onClick={onToggle} view="flat-secondary" size={'s'}>
                {renderCollapseIndicator()}
            </Button>
        </span>
    );
}

function formatValue(
    value: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'],
    settings: UnipikaSettings,
) {
    const __html = unipika.formatValue(value, settings, 0);
    return <span className={'unipika'} dangerouslySetInnerHTML={{__html}} />;
}
