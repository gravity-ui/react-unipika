import React, {FC, useState} from 'react';
import {Table as GravityTable, useWindowRowVirtualizer} from '@gravity-ui/table';

import {TableProps} from './types';
import {useGetTable, useScrollToIndex, block, rowClassName} from './utils';
import {useScrollMargin} from './useScrollMargin';

import './Table.scss';

export const Table: FC<TableProps> = ({scrollToRef, ...props}) => {
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const scrollMargin = useScrollMargin({element, timeout: 1000});

    const table = useGetTable(props);

    const rowVirtualizer = useWindowRowVirtualizer({
        count: table.getRowModel().rows.length,
        estimateSize: () => 20,
        overscan: 5,
        scrollMargin,
    });

    useScrollToIndex({scrollToRef, rowVirtualizer});

    return (
        <div className={block()} ref={setElement}>
            <GravityTable
                table={table}
                rowVirtualizer={rowVirtualizer}
                rowClassName={rowClassName}
                cellClassName={block('cell')}
                headerCellClassName={block('header-cell')}
            />
        </div>
    );
};
