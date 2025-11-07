import React, {useRef} from 'react';

import {Button, Icon, TextInput, ActionTooltip} from '@gravity-ui/uikit';
import {ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp} from '@gravity-ui/icons';

import {Toolbar} from '../Toolbar/Toolbar';
import {cn} from '../utils/classname';

import i18n from './i18n';

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
                    placeholder={i18n('description_search')}
                    onUpdate={onFilterChange}
                    autoFocus={false}
                    onKeyDown={onEnterKeyDown}
                    qa={'qa:structuredyson:search'}
                />

                <ActionTooltip title={i18n('action_next')}>
                    <Button
                        className={block('match-btn')}
                        view="flat-secondary"
                        onClick={onNextMatch}
                        disabled={!count}
                        pin={'clear-clear'}
                        qa={'qa:structuredyson:search:next'}
                    >
                        <Icon data={ChevronDown} />
                    </Button>
                </ActionTooltip>
                <ActionTooltip title={i18n('action_back')}>
                    <Button
                        className={block('match-btn')}
                        view="flat-secondary"
                        onClick={onPrevMatch}
                        disabled={!count}
                        pin={'brick-brick'}
                        qa={'qa:structuredyson:search:prev'}
                    >
                        <Icon data={ChevronUp} />
                    </Button>
                </ActionTooltip>
                <span className={block('match-counter')} title={i18n('description_matched-rows')}>
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
                            <ActionTooltip title={i18n('action_expand-all')}>
                                <Button onClick={onExpandAll} view="flat-secondary">
                                    <Icon data={ArrowDownToLine} />
                                </Button>
                            </ActionTooltip>
                            &nbsp;&nbsp;
                            <ActionTooltip title={i18n('action_collapse-all')}>
                                <Button onClick={onCollapseAll} view="flat-secondary">
                                    <Icon data={ArrowUpToLine} />
                                </Button>
                            </ActionTooltip>
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
