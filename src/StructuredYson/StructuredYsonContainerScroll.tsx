import React from 'react';

import {StructuredYsonBase, StructuredYsonBaseProps} from './StructuredYsonBase';
import {Table} from './Table/TableContainerScroll';

export interface StructuredYsonContainerScrollProps extends StructuredYsonBaseProps {
    scrollContainerRef: React.RefObject<Element | null>;
}

export class StructuredYsonContainerScroll extends StructuredYsonBase<StructuredYsonContainerScrollProps> {
    renderTable() {
        const {
            flattenResult: {data, searchIndex},
            yson,
            settings,
            filter,
        } = this.state;
        const {collapseIconType, showContainerSize, scrollContainerRef} = this.props;

        return (
            <Table
                data={data}
                searchIndex={searchIndex}
                unipikaSettings={settings}
                yson={yson}
                filter={filter}
                onToggleCollapse={this.onTogglePathCollapse}
                onShowFullText={this.onShowFullText}
                scrollToRef={this.tableRef}
                collapseIconType={collapseIconType}
                showContainerSize={showContainerSize}
                scrollContainerRef={scrollContainerRef}
            />
        );
    }
}
