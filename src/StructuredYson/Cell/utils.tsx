import React from 'react';
import {Icon} from '@gravity-ui/uikit';

// @ts-ignore
import unipika from '@gravity-ui/unipika/lib/unipika';

import {ArrowUpRightFromSquare} from '@gravity-ui/icons';

import {UnipikaSettings} from '../types';
import {UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';

import {ClickableText} from '../../ClickableText/ClickableText';

import {cn} from '../../utils/classname';

import {FilteredText} from '../FilteredText';

export const block = cn('g-ru-cell');

export function formatValue(
    value: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'],
    settings: UnipikaSettings,
) {
    const __html = unipika.formatValue(value, settings, 0);
    return <span className={'unipika'} dangerouslySetInnerHTML={{__html}} />;
}

type RenderStringProps = {
    text: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'];
    settings: UnipikaSettings;
    matched?: Array<number>;
    filter?: string;
    showFullText?: () => void;
};

export function renderStringWithFilter(
    props: RenderStringProps,
    className: string,
    maxWidth = Infinity,
) {
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
