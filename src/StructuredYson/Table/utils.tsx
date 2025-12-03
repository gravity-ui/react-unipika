import React from 'react';
import {useRowVirtualizer, useTable, useWindowRowVirtualizer} from '@gravity-ui/table';
import type {ColumnDef, Row} from '@gravity-ui/table/tanstack';
import {UnipikaFlattenTreeItem} from '../../utils/flattenUnipika';

import {asModifier, Cell} from '../Cell';
import {cn} from '../../utils/classname';
import {TableProps} from './types';

export const block = cn('g-ru-table');

export function rowClassName(row?: Row<UnipikaFlattenTreeItem>) {
    const {key} = row?.original ?? {};
    const k = key?.$decoded_value ?? '';
    return block('row', {key: asModifier(k)});
}

export function useScrollToIndex({
    scrollToRef,
    rowVirtualizer,
}: Pick<TableProps, 'scrollToRef'> & {
    rowVirtualizer:
        | ReturnType<typeof useWindowRowVirtualizer>
        | ReturnType<typeof useRowVirtualizer>;
}) {
    React.useEffect(() => {
        scrollToRef.current = {
            scrollToIndex: (index: number) =>
                rowVirtualizer.scrollToIndex(index, {align: 'center'}),
        };
    }, [scrollToRef, rowVirtualizer]);
}

export function useGetTable({
    data,
    searchIndex,
    unipikaSettings,
    yson,
    filter,
    onToggleCollapse,
    onShowFullText,
    collapseIconType,
    showContainerSize,
}: Omit<TableProps, 'scrollToRef'>) {
    const bodyRef = React.useRef<HTMLTableSectionElement>(null);

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

    return {table, bodyRef};
}
