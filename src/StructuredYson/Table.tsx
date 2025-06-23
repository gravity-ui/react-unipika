import React from 'react';
import {Table as GravityTable, useTable, useWindowRowVirtualizer} from '@gravity-ui/table';
import type {ColumnDef, Row} from '@gravity-ui/table/tanstack';
import {UnipikaFlattenTreeItem, SearchInfo} from '../utils/flattenUnipika';
import {UnipikaSettings} from '../StructuredYson/types';
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

    const bodyRef = React.useRef<HTMLTableSectionElement>(null);

    const rowVirtulization = useWindowRowVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => 20,
        overscan: 5,
        scrollMargin: bodyRef.current?.offsetTop ?? 0,
    });

    React.useEffect(() => {
        scrollToRef.current = {
            scrollToIndex: (index: number) =>
                rowVirtulization.scrollToIndex(index, {align: 'center'}),
        };
    }, [scrollToRef, rowVirtulization]);

    return (
        <div className={block()}>
            <GravityTable
                table={table}
                rowVirtualizer={rowVirtulization}
                rowClassName={rowClassName}
                cellClassName={block('cell')}
                headerCellClassName={block('header-cell')}
                bodyRef={bodyRef}
            />
        </div>
    );
};

function rowClassName(row?: Row<UnipikaFlattenTreeItem>) {
    const {key} = row?.original ?? {};
    const k = key?.$decoded_value ?? '';
    return block('row', {key: asModifier(k)});
}
