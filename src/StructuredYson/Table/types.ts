import type {
    UnipikaFlattenTreeItem,
    UnipikaFlattenTreePath,
    SearchInfo,
} from '../../utils/flattenUnipika';
import type {UnipikaSettings, CollapseIconType, RenderRowExtraTools} from '../types';

export interface TableProps {
    data: UnipikaFlattenTreeItem[];
    searchIndex: Record<number, SearchInfo>;
    unipikaSettings: UnipikaSettings;
    yson: boolean;
    filter: string;
    onToggleCollapse: (path: UnipikaFlattenTreePath) => void;
    onShowFullText: (index: number) => void;
    scrollToRef: React.RefObject<null | {scrollToIndex(index: number): void}>;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
    renderRowExtraTools?: RenderRowExtraTools;
}

export interface TablePropsWithScrollContainer extends TableProps {
    scrollContainerRef: React.RefObject<Element | null>;
}
