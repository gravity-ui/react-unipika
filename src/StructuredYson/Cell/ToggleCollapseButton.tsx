import React from 'react';
import {Button, Icon} from '@gravity-ui/uikit';

import {ChevronUp, ChevronRight} from '@gravity-ui/icons';

import type {CollapseIconType} from '../types';
import type {UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';
import {nodePathToYPath} from '../../utils/nodePathToYPath';

import {block} from './utils';

type Props = {
    collapsed?: boolean;
    path?: UnipikaFlattenTreeItem['path'];
    onToggle: () => void;
    collapseIconType?: CollapseIconType;
};

export function ToggleCollapseButton(props: Props) {
    const {collapsed, onToggle, path, collapseIconType} = props;

    const title = path ? nodePathToYPath(path) : undefined;

    // Function to render the appropriate collapse indicator based on type
    const renderCollapseIndicator = () => {
        switch (collapseIconType) {
            case 'chevron':
                return <Icon className={'unipika'} data={collapsed ? ChevronRight : ChevronUp} />;
            // Future icon types can be added here as new cases
            default:
                return <span className={'unipika'}>{collapsed ? '[+]' : '[-]'}</span>;
        }
    };

    return (
        <span title={title} className={block('collapse')}>
            <Button onClick={onToggle} view="flat-secondary" size={'s'}>
                {renderCollapseIndicator()}
            </Button>
        </span>
    );
}
