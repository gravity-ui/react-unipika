import React, {useRef} from 'react';

import {Button, Icon, TextInput} from '@gravity-ui/uikit';
import {ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp} from '@gravity-ui/icons';

import {Toolbar} from '../Toolbar/Toolbar';
import {cn} from '../utils/classname';

import './StructuredYson.scss';

const block = cn('g-ru-structured-yson');

interface StructuredYsonToolbarProps {
    className?: string;
    filter: string;
    matchIndex: number;
    matchedRows: Array<number>;
    extraTools?: React.ReactNode;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    onFilterChange: (filter: string) => void;
    onNextMatch: (_event: unknown, diff?: number) => void;
    onPrevMatch: () => void;
    onEnterKeyDown: (e: React.KeyboardEvent) => void;
}

export const StructuredYsonToolbar: React.FC<StructuredYsonToolbarProps> = ({
    className,
    filter,
    matchIndex,
    matchedRows,
    extraTools,
    onExpandAll,
    onCollapseAll,
    onFilterChange,
    onNextMatch,
    onPrevMatch,
    onEnterKeyDown,
}) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const count = matchedRows.length;
    const matchPosition = count ? 1 + (matchIndex % count) : 0;
    const renderFilter = () => {
        return (
            <React.Fragment>
                <TextInput
                    controlRef={searchRef}
                    className={block('filter')}
                    hasClear
                    size="m"
                    type="text"
                    value={filter}
                    placeholder="Search..."
                    onUpdate={onFilterChange}
                    autoFocus={false}
                    onKeyDown={onEnterKeyDown}
                    qa={'qa:structuredyson:search'}
                />
                <Button
                    className={block('match-btn')}
                    view="flat-secondary"
                    title="Next"
                    onClick={onNextMatch}
                    disabled={!count}
                    pin={'clear-clear'}
                    qa={'qa:structuredyson:search:next'}
                >
                    <Icon data={ChevronDown} />
                </Button>
                <Button
                    className={block('match-btn')}
                    view="flat-secondary"
                    title="Back"
                    onClick={onPrevMatch}
                    disabled={!count}
                    pin={'brick-brick'}
                    qa={'qa:structuredyson:search:prev'}
                >
                    <Icon data={ChevronUp} />
                </Button>
                <span className={block('match-counter')} title={'Matched rows'}>
                    {matchPosition} / {count || 0}
                </span>
            </React.Fragment>
        );
    };

    return (
        <Toolbar
            className={block('toolbar', className)}
            itemsToWrap={[
                {
                    name: 'buttons',
                    node: (
                        <span className={block('buttons')}>
                            <Button title="Expand all" onClick={onExpandAll}>
                                <Icon data={ArrowDownToLine} />
                            </Button>
                            &nbsp;&nbsp;
                            <Button onClick={onCollapseAll} title="Collapse all">
                                <Icon data={ArrowUpToLine} />
                            </Button>
                        </span>
                    ),
                },
                {
                    name: 'filter',
                    node: renderFilter(),
                },
                {
                    name: 'extra-tools',
                    node: !extraTools ? null : (
                        <span className={block('extra-tools')}>{extraTools}</span>
                    ),
                },
            ]}
        />
    );
};
