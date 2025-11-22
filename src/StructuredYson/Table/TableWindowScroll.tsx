import React from 'react';
import {Table as GravityTable, useWindowRowVirtualizer} from '@gravity-ui/table';

import {TableProps} from './types';
import './Table.scss';
import {useGetTable, useScrollToIndex, block, rowClassName} from './utils';

export const Table: React.FC<TableProps> = ({scrollToRef, ...props}) => {
    const {table, bodyRef} = useGetTable(props);

    const rowVirtualizer = useWindowRowVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => 20,
        overscan: 5,
        scrollMargin: bodyRef?.current?.offsetTop ?? 0,
    });

    useScrollToIndex({scrollToRef, rowVirtualizer});

    return (
        <div className={block()}>
            <GravityTable
                table={table}
                rowVirtualizer={rowVirtualizer}
                rowClassName={rowClassName}
                cellClassName={block('cell')}
                headerCellClassName={block('header-cell')}
                bodyRef={bodyRef}
            />
        </div>
    );
};
