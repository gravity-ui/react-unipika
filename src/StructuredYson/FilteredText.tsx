import React from 'react';

import {MultiHighlightedText, MultiHighlightedTextProps} from '../HighlightedText/HighlightedText';

import {cn} from '../utils/classname';

import './FilteredText.scss';

const block = cn('g-ru-filtered-text');

export function FilteredText({
    className,
    ...props
}: Omit<MultiHighlightedTextProps, 'classNameHighlighted'>) {
    return (
        <MultiHighlightedText
            {...props}
            className={block(null, className)}
            classNameHighlighted={block({highlighted: true}, className)}
        />
    );
}
