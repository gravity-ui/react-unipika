import React from 'react';

import {MultiHighlightedText, MultiHighlightedTextProps} from '../HighlightedText/HighlightedText';

import {cn} from '../utils/classname';

const block = cn('g-ru-cell');

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
