import {type ReactNode} from 'react';

import type {
    UnipikaSettings,
    ToolbarProps,
    CollapseIconType,
    RenderRowExtraTools,
} from '../StructuredYson/types';

export interface ReactUnipikaCommonProps {
    settings?: UnipikaSettings;
    value: any;
    inline?: boolean;
    children?: ReactNode;
    extraTools?: ReactNode;
    virtualized?: boolean;
    className?: string;
    customLayout?: (args: {toolbar: ReactNode; content: ReactNode}) => ReactNode;
    toolbarStickyTop?: number;
    renderToolbar?: (props: ToolbarProps) => ReactNode;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
    initiallyCollapsed?: boolean;
    caseInsensitiveSearch?: boolean;
    renderError?: (error: unknown) => ReactNode;
    renderRowExtraTools?: RenderRowExtraTools;
}

export interface ReactUnipikaWithScrollContainer extends ReactUnipikaCommonProps {
    scrollContainerRef: React.RefObject<Element | null>;
}
