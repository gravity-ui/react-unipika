import React from 'react';

import {Meta, StoryObj} from '@storybook/react';

import {ReactUnipika, ReactUnipikaProps} from '../../index';

import data from './data.json';

const meta: Meta<ReactUnipikaProps> = {
    title: 'ReactUnipika',
    component: ReactUnipika,
};
export default meta;

export const Json: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
    },
};

export const Yson: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        settings: {format: 'yson'},
    },
};

export const WithContentAbove: StoryObj<ReactUnipikaProps> = {
    render() {
        return (
            <>
                <div style={{height: 500, padding: 250, boxSizing: 'border-box'}}>
                    Some content above
                </div>
                <ReactUnipika value={data} />
            </>
        );
    },
};

export const WithContainerSize: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        showContainerSize: true,
    },
};

export const WithContainerSizeCollapsed: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        showContainerSize: true,
        initiallyCollapsed: true,
    },
};

export const WithContainerSizeYson: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        settings: {format: 'yson'},
        showContainerSize: true,
    },
};
