import React from 'react';

// @ts-ignore
import unipika from '@gravity-ui/unipika/lib/unipika';

import {UnipikaSettings} from '../types';
import {UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';

import {FilteredText} from '../FilteredText';

import {JSON_VALUE_KEY} from './constants';
import {block, formatValue, renderStringWithFilter} from './utils';

type Props = {
    text: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'];
    yson?: boolean;
    settings: UnipikaSettings;
    isAfterAttributes?: boolean;
    filter?: string;
    matched?: Array<number>;
    showFullText?: () => void;
};

export function Value(props: Props) {
    return <>{renderValueWithFilter(props, block('value', {type: props.text?.$type}))}</>;
}

function renderValueWithFilter(props: Props, className: string) {
    if ('string' === props.text?.$type) {
        return renderStringWithFilter(props, className, 100);
    }
    return renderWithFilter(props, block('value'));
}

function renderWithFilter(props: Props, className: string) {
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
