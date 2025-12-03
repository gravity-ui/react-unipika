import {UnipikaFlattenTreeItem, SearchInfo} from '../../utils/flattenUnipika';
import {UnipikaSettings, CollapseIconType} from '../types';

export interface TableProps {
    data: UnipikaFlattenTreeItem[];
    searchIndex: Record<number, SearchInfo>;
    unipikaSettings: UnipikaSettings;
    yson: boolean;
    filter: string;
    onToggleCollapse: (path: string) => void;
    onShowFullText: (index: number) => void;
    scrollToRef: React.RefObject<null | {scrollToIndex(index: number): void}>;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
}

export interface TablePropsWithScrollContainer extends TableProps {
    scrollContainerRef: React.RefObject<Element | null>;
}
