import React from 'react';
import type {ToolbarProps} from '../../StructuredYson/types';

export function CustomToolbarExample({
    onFilterChange,
    onExpandAll,
    onCollapseAll,
    isCollapsed,
}: ToolbarProps) {
    return (
        <div
            style={{
                padding: '8px',
                background: 'var(--g-color-base-background)',
                borderBottom: '1px solid var(--g-color-line-generic)',
                position: 'sticky',
                top: '0px',
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
                zIndex: '1',
            }}
        >
            <input
                placeholder="Custom search..."
                onChange={(e) => onFilterChange(e.target.value)}
                data-qa="custom-toolbar-search"
                style={{
                    padding: '4px 8px',
                    border: '1px solid var(--g-color-line-generic)',
                    borderRadius: '4px',
                    flex: 1,
                }}
            />
            <button
                onClick={isCollapsed ? onExpandAll : onCollapseAll}
                data-qa="custom-toolbar-toggle"
                style={{
                    padding: '4px 12px',
                    border: '1px solid var(--g-color-line-generic)',
                    borderRadius: '4px',
                    background: 'var(--g-color-base-background)',
                    cursor: 'pointer',
                }}
            >
                {isCollapsed ? 'Expand All' : 'Collapse All'}
            </button>
        </div>
    );
}
