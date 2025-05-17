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
