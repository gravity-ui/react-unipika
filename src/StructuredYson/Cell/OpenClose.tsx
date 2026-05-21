import React from 'react';

import {UnipikaSettings} from '../types';
import {BlockType} from '../../utils/flattenUnipika';

import {JSON_ATTRIBUTES_KEY} from './constants';
import {Key} from './Key';
import {SlaveText} from './SlaveText';

type Props = {
    type: BlockType;
    yson: boolean;
    close?: boolean;
    settings: UnipikaSettings;
};

export function OpenClose(props: Props) {
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
