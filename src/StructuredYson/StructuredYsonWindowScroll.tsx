import React from 'react';

import {StructuredYsonBase, StructuredYsonBaseProps} from './StructuredYsonBase';
import {Table} from './Table/TableWindowScroll';

export class StructuredYsonWindowScroll extends StructuredYsonBase<StructuredYsonBaseProps> {
    renderTable() {
        const {
            flattenResult: {data, searchIndex},
            yson,
            settings,
            filter,
        } = this.state;
        const {collapseIconType, showContainerSize} = this.props;

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
            />
        );
    }
}
