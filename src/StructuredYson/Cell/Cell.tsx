import React from 'react';

import {CollapseIconType, UnipikaSettings} from '../types';
import {SearchInfo, UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';

import i18n from '../i18n';

import {Key} from './Key';
import {OpenClose} from './OpenClose';
import {SlaveText} from './SlaveText';
import {ToggleCollapseButton} from './ToggleCollapseButton';
import {Value} from './Value';
import {block} from './utils';

import './Cell.scss';

type Props = {
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

export function Cell(props: Props) {
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
            size,
            hiddenMatches,
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
            {props.showContainerSize && size !== undefined && (
                <span
                    className={block('filtered', {highlighted: Boolean(hiddenMatches)}, 'unipika')}
                >
                    {i18n('context_items-count', {count: size})}
                </span>
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
            {collapsed && (size === undefined || !props.showContainerSize) && (
                <span
                    className={block('filtered', {highlighted: Boolean(hiddenMatches)}, 'unipika')}
                >
                    ...
                </span>
            )}
            {close && <OpenClose type={close} yson={yson} settings={settings} close />}
            {hasDelimiter && <SlaveText text={yson ? ';' : ','} />}
            {collapsed && hiddenMatches && (
                <span className={block('hidden-matches')}>
                    ({i18n('context_matches-count', {count: hiddenMatches})})
                </span>
            )}
        </div>
    );
}
