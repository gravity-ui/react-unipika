import React from 'react';
import {
    Table as GravityTable,
    useRowVirtualizer,
    useTable,
    useWindowRowVirtualizer,
} from '@gravity-ui/table';
import type {ColumnDef, Row} from '@gravity-ui/table/tanstack';
import {UnipikaFlattenTreeItem, SearchInfo} from '../utils/flattenUnipika';
import {CollapseIconType, UnipikaSettings} from '../StructuredYson/types';
import {asModifier, Cell} from './Cell';
import {cn} from '../utils/classname';

import './Table.scss';

const block = cn('g-ru-table');

export interface TableProps {
    data: UnipikaFlattenTreeItem[];
    searchIndex: Record<number, SearchInfo>;
    unipikaSettings: UnipikaSettings;
    yson: boolean;
    filter: string;
    onToggleCollapse: (path: string) => void;
    onShowFullText: (index: number) => void;
    scrollToRef: React.RefObject<null | {scrollToIndex(index: number): void}>;
    scrollContainerRef?: React.RefObject<Element | null>;
    withScrollElement?: boolean;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
}

export const Table: React.FC<TableProps> = ({
    data,
    searchIndex,
    unipikaSettings,
    yson,
    filter,
    onToggleCollapse,
    onShowFullText,
    scrollToRef,
    scrollContainerRef,
    withScrollElement,
    collapseIconType,
    showContainerSize,
}) => {
    const renderCell: ColumnDef<UnipikaFlattenTreeItem>['cell'] = ({row}) => {
        const {original, index} = row;
        return (
            <Cell
                matched={searchIndex[index]}
                row={original}
                yson={yson}
                settings={unipikaSettings}
                onToggleCollapse={onToggleCollapse}
                filter={filter}
                showFullText={onShowFullText}
                index={index}
                collapseIconType={collapseIconType}
                showContainerSize={showContainerSize}
            />
        );
    };

    const columns: Array<ColumnDef<UnipikaFlattenTreeItem>> = [
        {accessorKey: '', cell: renderCell, id: 'content'},
    ];

    const table = useTable({
        columns,
        data,
    });

    const {rowVirtualizer, windowRowVirtualizer, bodyRef} = useRowVirtualization(
        table.getRowModel().rows.length,
        scrollContainerRef,
    );

    const activeVirtualizer = withScrollElement ? rowVirtualizer : windowRowVirtualizer;

    React.useEffect(() => {
        scrollToRef.current = {
            scrollToIndex: (index: number) =>
                activeVirtualizer.scrollToIndex(index, {align: 'center'}),
        };
    }, [scrollToRef, activeVirtualizer]);

    return (
        <div className={block()}>
            {withScrollElement ? (
                <GravityTable
                    table={table}
                    rowVirtualizer={rowVirtualizer}
                    rowClassName={rowClassName}
                    cellClassName={block('cell')}
                    headerCellClassName={block('header-cell')}
                    bodyRef={bodyRef}
                />
            ) : (
                <GravityTable
                    table={table}
                    rowVirtualizer={windowRowVirtualizer}
                    rowClassName={rowClassName}
                    cellClassName={block('cell')}
                    headerCellClassName={block('header-cell')}
                    bodyRef={bodyRef}
                />
            )}
        </div>
    );
};

function rowClassName(row?: Row<UnipikaFlattenTreeItem>) {
    const {key} = row?.original ?? {};
    const k = key?.$decoded_value ?? '';
    return block('row', {key: asModifier(k)});
}

function useRowVirtualization(count: number, scrollContainerRef?: React.RefObject<Element | null>) {
    const bodyRef = React.useRef<HTMLTableSectionElement>(null);
    const windowRowVirtualizer = useWindowRowVirtualizer({
        count,
        estimateSize: () => 20,
        overscan: 5,
        scrollMargin: bodyRef?.current?.offsetTop ?? 0,
    });

    const rowVirtualizer = useRowVirtualizer({
        count,
        estimateSize: () => 20,
        overscan: 5,
        getScrollElement: () => scrollContainerRef?.current || null,
    });

    return {rowVirtualizer, windowRowVirtualizer, bodyRef};
}
