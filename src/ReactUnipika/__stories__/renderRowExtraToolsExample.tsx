import React from 'react';
import {Button, Flex, Icon} from '@gravity-ui/uikit';
import {Copy, ArrowDownToSquare} from '@gravity-ui/icons';
import type {RenderRowExtraTools} from '../../StructuredYson/types';

export const renderRowExtraToolsExample: RenderRowExtraTools = ({value}) => {
    if (!value) {
        return null;
    }

    return (
        <Flex gap={1}>
            <Button size="xs">
                <Icon data={Copy} size={12} />
            </Button>

            <Button size="xs">
                <Icon data={ArrowDownToSquare} size={12} />
            </Button>
        </Flex>
    );
};
