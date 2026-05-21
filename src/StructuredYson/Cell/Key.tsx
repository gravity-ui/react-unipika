import React from 'react';

import {UnipikaSettings} from '../types';
import {UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';

import {JSON_VALUE_KEY} from './constants';
import {SlaveText} from './SlaveText';
import {block, formatValue, renderStringWithFilter} from './utils';

type Props = {
    text: UnipikaFlattenTreeItem['key'] | UnipikaFlattenTreeItem['value'];
    yson?: boolean;
    settings: UnipikaSettings;
    isAfterAttributes?: boolean;
    filter?: string;
    matched?: Array<number>;
};

export function Key(props: Props) {
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

function renderKeyWithFilter(props: Props) {
    const {yson, isAfterAttributes, settings} = props;
    if (!yson && isAfterAttributes) {
        return formatValue(JSON_VALUE_KEY, settings);
    }

    if (!props?.text) {
        return null;
    }
    return renderStringWithFilter(props, block('key'));
}
