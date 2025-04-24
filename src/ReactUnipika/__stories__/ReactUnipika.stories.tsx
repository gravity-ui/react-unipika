import {Meta, StoryObj} from '@storybook/react';

import {ReactUnipika, ReactUnipikaProps} from '../../index';

const meta: Meta<ReactUnipikaProps> = {
    title: 'ReactUnipika',
    component: ReactUnipika,
};
export default meta;

export const Default: StoryObj<ReactUnipikaProps> = {
    args: {
        value: {foo: 'bar', hello: {world: 'Hello world'}},
    },
};
