import React from 'react';

import {cn} from '../utils/classname';

import './ClickableText.scss';
const block = cn('g-ru-clickable-text');

export type ClickableTextProps = {
    className?: string;
    /**
     * 'info' is default value
     */
    color?: 'info' | 'secondary' | 'primary';
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    title?: string;
};

export function ClickableText({className, color = 'info', onClick, children}: ClickableTextProps) {
    return (
        <span className={block({color}, className)} role="button" onClick={onClick}>
            {children}
        </span>
    );
}
