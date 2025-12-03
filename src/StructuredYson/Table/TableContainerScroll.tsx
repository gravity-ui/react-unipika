import React from 'react';
import {Table as GravityTable, useRowVirtualizer} from '@gravity-ui/table';

import {TablePropsWithScrollContainer} from './types';
import './Table.scss';
import {useGetTable, useScrollToIndex, block, rowClassName} from './utils';

export const Table: React.FC<TablePropsWithScrollContainer> = ({
    scrollToRef,
    scrollContainerRef,
    ...props
}) => {
    const {table, bodyRef} = useGetTable(props);

    const rowVirtualizer = useRowVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => 20,
        overscan: 5,
        getScrollElement: () => scrollContainerRef?.current || null,
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
