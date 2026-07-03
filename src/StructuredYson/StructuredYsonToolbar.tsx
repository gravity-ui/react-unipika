import React, {useRef} from 'react';

import {Button, Flex, Icon, TextInput, ActionTooltip, Text} from '@gravity-ui/uikit';
import {ChevronDown, ChevronUp, ChevronsDown, ChevronsUp} from '@gravity-ui/icons';

import {Toolbar} from '../Toolbar/Toolbar';
import {cn} from '../utils/classname';
import type {UnipikaFlattenTreeJoinedPath} from '../utils/flattenUnipika';

import i18n from './i18n';

import './StructuredYson.scss';

const block = cn('g-ru-structured-yson');

interface StructuredYsonToolbarProps {
    className?: string;
    filter: string;
    matchIndex: number;
    matchedRows: Array<number>;
    allMatchPaths?: Array<UnipikaFlattenTreeJoinedPath>;
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
    allMatchPaths,
    extraTools,
    onExpandAll,
    onCollapseAll,
    onFilterChange,
    onNextMatch,
    onPrevMatch,
    onEnterKeyDown,
}) => {
    const searchRef = useRef<HTMLInputElement>(null);

    // Use total matches (including hidden) if available, otherwise use visible matches
    const totalMatches = allMatchPaths?.length || 0;
    const count = totalMatches || matchedRows.length;
    const matchPosition = count ? 1 + (matchIndex % count) : 0;

    const renderFilter = () => {
        return (
            <Flex gap={1} alignItems="center">
                <TextInput
                    controlRef={searchRef}
                    hasClear
                    size="m"
                    type="text"
                    value={filter}
                    placeholder={i18n('description_search')}
                    onUpdate={onFilterChange}
                    autoFocus={false}
                    onKeyDown={onEnterKeyDown}
                    qa="qa:structuredyson:search"
                />

                <ActionTooltip title={i18n('action_next')}>
                    <Button
                        view="flat-secondary"
                        onClick={onNextMatch}
                        disabled={!count}
                        qa="qa:structuredyson:search:next"
                    >
                        <Icon data={ChevronDown} />
                    </Button>
                </ActionTooltip>

                <ActionTooltip title={i18n('action_back')}>
                    <Button
                        view="flat-secondary"
                        onClick={onPrevMatch}
                        disabled={!count}
                        qa="qa:structuredyson:search:prev"
                    >
                        <Icon data={ChevronUp} />
                    </Button>
                </ActionTooltip>

                <Text
                    whiteSpace="nowrap"
                    color="secondary"
                    title={i18n('label_matched-rows')}
                    qa="qa:structuredyson:search:match-counter"
                >
                    {matchPosition} / {count}
                </Text>
            </Flex>
        );
    };

    return (
        <Toolbar
            className={block('toolbar', className)}
            itemsToWrap={[
                {
                    name: 'buttons',
                    node: (
                        <Flex gap={2} wrap="nowrap">
                            <ActionTooltip title={i18n('action_expand-all')}>
                                <Button
                                    view="outlined"
                                    onClick={onExpandAll}
                                    qa="qa:structuredyson:expand-all"
                                >
                                    <Icon data={ChevronsDown} />
                                </Button>
                            </ActionTooltip>

                            <ActionTooltip title={i18n('action_collapse-all')}>
                                <Button
                                    view="outlined"
                                    onClick={onCollapseAll}
                                    qa="qa:structuredyson:collapse-all"
                                >
                                    <Icon data={ChevronsUp} />
                                </Button>
                            </ActionTooltip>
                        </Flex>
                    ),
                },
                {
                    name: 'filter',
                    node: renderFilter(),
                },
                {
                    name: 'extra-tools',
                    node: extraTools ? (
                        <span className={block('extra-tools')}>{extraTools}</span>
                    ) : null,
                },
            ]}
        />
    );
};
