import type {UnipikaSettings, ToolbarProps, CollapseIconType} from '../StructuredYson/types';

export interface ReactUnipikaCommonProps {
    settings?: UnipikaSettings;
    value: any;
    inline?: boolean;
    children?: React.ReactNode;
    extraTools?: React.ReactNode;
    virtualized?: boolean;
    className?: string;
    customLayout?: (args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode;
    toolbarStickyTop?: number;
    renderToolbar?: (props: ToolbarProps) => React.ReactNode;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
    initiallyCollapsed?: boolean;
    caseInsensitiveSearch?: boolean;
    renderError?: (error: unknown) => React.ReactNode;
}

export interface ReactUnipikaWithScrollContainer extends ReactUnipikaCommonProps {
    scrollContainerRef: React.RefObject<Element | null>;
}
