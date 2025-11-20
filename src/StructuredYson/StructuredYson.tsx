import React from 'react';

import isEmpty_ from 'lodash/isEmpty';
import reduce_ from 'lodash/reduce';

// @ts-ignore
import unipika from '@gravity-ui/unipika/lib/unipika';

import {
    CollapseIconType,
    ToolbarProps,
    UnipikaSettings,
    UnipikaValue,
} from '../StructuredYson/types';
import {
    CollapsedState,
    FlattenUnipikaResult,
    SearchInfo,
    UnipikaFlattenTreeItem,
    flattenUnipika,
} from '../utils/flattenUnipika';

import {StickyContainer} from '../StickyContainer/StickyContainer';
import {StructuredYsonToolbar} from './StructuredYsonToolbar';
import {FullValueDialog} from './FullValueDialog';
import {Table, TableProps} from './Table';

import {cn} from '../utils/classname';

import './StructuredYson.scss';

const block = cn('g-ru-structured-yson');

interface Props {
    value: UnipikaValue;
    settings: UnipikaSettings;
    extraTools?: React.ReactNode;
    customLayout?: (args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode;
    toolbarStickyTop?: number;
    renderToolbar?: (props: ToolbarProps) => React.ReactNode;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
    initiallyCollapsed?: boolean;
    caseInsensitiveSearch?: boolean;
}

interface State {
    flattenResult: FlattenUnipikaResult;
    value: Props['value'];
    settings: Props['settings'];
    yson: boolean;
    caseInsensitiveSearch?: boolean;
    collapsedState: CollapsedState;
    filter: string;
    matchIndex: number;
    matchedRows: Array<number>;
    allMatchPaths: Array<string>;
    fullValue?: {
        value: UnipikaFlattenTreeItem['value'];
        searchInfo?: SearchInfo;
    };
}

function calculateState(
    value: State['value'],
    collapsedState: CollapsedState,
    filter: string,
    caseInsensitive: boolean | undefined,
    settings: UnipikaSettings,
) {
    const flattenResult = flattenUnipika(value, {
        isJson: settings.format !== 'yson',
        collapsedState: collapsedState,
        filter,
        settings: settings,
        caseInsensitive,
    });

    const allMatchPaths = flattenResult.allMatchPaths || [];
    // Calculate hiddenMatches for collapsed nodes
    if (allMatchPaths.length > 0) {
        // Count matches that are inside or at collapsed nodes
        flattenResult.data.forEach((item) => {
            if (item.collapsed && item.path) {
                const itemPath = item.path;
                const count = allMatchPaths.filter((matchPath) => {
                    const sameStart = matchPath.startsWith(itemPath);
                    if (!sameStart) {
                        return false;
                    }
                    if (itemPath.length === matchPath.length) {
                        // exact match
                        return true;
                    }
                    if (matchPath[itemPath.length] === '/') {
                        // match inside the node
                        return true;
                    }
                    return false;
                }).length;
                if (count > 0) {
                    item.hiddenMatches = count;
                }
            }
        });
    }

    return Object.assign(
        {},
        {
            flattenResult,
            matchedRows: Object.keys(flattenResult.searchIndex).map(Number),
            allMatchPaths,
        },
    );
}

export class StructuredYson extends React.PureComponent<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State) {
        const {
            value: prevValue,
            settings: prevSettings,
            yson: prevYson,
            caseInsensitiveSearch: prevCaseInsensitiveSearch,
        } = state;
        const {value, settings, caseInsensitiveSearch} = props;
        const res: Partial<State> = {};
        const yson = settings.format === 'yson';
        if (
            prevSettings !== settings ||
            yson !== prevYson ||
            caseInsensitiveSearch !== prevCaseInsensitiveSearch
        ) {
            Object.assign<Partial<State>, Partial<State>>(res, {
                settings,
                yson,
                caseInsensitiveSearch,
            });
        }
        if (prevValue !== value || !isEmpty_(res)) {
            Object.assign<Partial<State>, Partial<State>>(res, {
                value,
                ...calculateState(
                    value,
                    state.collapsedState,
                    state.filter,
                    caseInsensitiveSearch,
                    settings,
                ),
            });
        }
        return isEmpty_(res) ? null : res;
    }

    state: State = this.getInitialState();

    tableRef: TableProps['scrollToRef'] = React.createRef();
    searchRef = React.createRef<HTMLInputElement>();

    getInitialState(): State {
        const {initiallyCollapsed, value, settings, caseInsensitiveSearch} = this.props;
        const collapsedState = initiallyCollapsed
            ? this.getFullyCollapsedState(value, settings.format !== 'yson')
            : {};

        return {
            value: {} as any, // valid value will be provided from getDerivedStateFromProps call
            flattenResult: {data: [], searchIndex: {}},
            settings: {},
            yson: true,
            collapsedState,

            filter: '',
            matchIndex: -1,
            matchedRows: [],
            allMatchPaths: [],
            caseInsensitiveSearch,
        };
    }

    onTogglePathCollapse = (path: string) => {
        const {collapsedState: oldState} = this.state;
        const collapsedState = {...oldState};
        if (collapsedState[path]) {
            delete collapsedState[path];
        } else {
            collapsedState[path] = true;
        }

        this.updateState({collapsedState});
    };

    updateState(
        changedState: Partial<Pick<State, 'collapsedState' | 'filter' | 'matchIndex'>>,
        cb?: () => void,
    ) {
        const {value, settings, caseInsensitiveSearch} = this.state;
        const {
            collapsedState = this.state.collapsedState,
            matchIndex = this.state.matchIndex,
            filter = this.state.filter,
        } = changedState;

        this.setState(
            {
                collapsedState,
                filter,
                matchIndex,
                ...calculateState(value, collapsedState, filter, caseInsensitiveSearch, settings),
            },
            cb,
        );
    }

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
    onExpandAll = () => {
        this.updateState({collapsedState: {}}, () => {
            this.onNextMatch(null, 0);
        });
    };

    onCollapseAll = () => {
        const {value, yson} = this.state;
        const collapsedState = this.getFullyCollapsedState(value, !yson);
        this.updateState({collapsedState});
    };

    onFilterChange = (filter: string) => {
        this.updateState({filter, matchIndex: 0}, () => {
            this.onNextMatch(null, 0);
        });
    };

    findCollapsedParent = (matchPath: string, collapsedState: CollapsedState): string | null => {
        let nextSlash = 0;
        while ((nextSlash = matchPath.indexOf('/', nextSlash)) !== -1) {
            const checkPath = matchPath.slice(0, nextSlash);
            if (collapsedState[checkPath]) {
                return checkPath;
            }
            nextSlash++;
        }
        // Check the full path as well
        if (collapsedState[matchPath]) {
            return matchPath;
        }
        return null;
    };

    navigateToMatch = (
        targetIndex: number,
        allMatchPaths: Array<string>,
        matchedRows: Array<number>,
        collapsedState: CollapsedState,
    ) => {
        // Count how many visible matches are before our target
        let visibleMatchCount = 0;
        for (let i = 0; i < targetIndex; i++) {
            if (this.findCollapsedParent(allMatchPaths[i], collapsedState) === null) {
                visibleMatchCount++;
            }
        }

        // Navigate to the visible match
        if (visibleMatchCount < matchedRows.length) {
            this.setState({matchIndex: targetIndex});
            this.tableRef.current?.scrollToIndex(matchedRows[visibleMatchCount]);
            this.searchRef.current?.focus();
        }
    };

    onNextMatch = (_event: unknown, diff = 1) => {
        const {matchIndex, matchedRows, allMatchPaths, collapsedState} = this.state;

        const totalMatches = allMatchPaths?.length || 0;

        if (totalMatches === 0) {
            return;
        }

        // Calculate next index in total matches
        const nextTotalIndex = (totalMatches + matchIndex + diff) % totalMatches;

        const targetMatchPath = allMatchPaths[nextTotalIndex];

        // Expand all collapsed parents at once
        let effectiveCollapsedState = collapsedState;
        let collapsedParent: string | null;

        // Keep expanding collapsed parents until target is fully visible
        while (
            (collapsedParent = this.findCollapsedParent(targetMatchPath, effectiveCollapsedState))
        ) {
            // Lazy copy on first modification
            if (effectiveCollapsedState === collapsedState) {
                effectiveCollapsedState = {...collapsedState};
            }
            delete effectiveCollapsedState[collapsedParent];
        }

        // If we expanded any parents, recalculate state and retry
        if (collapsedState !== effectiveCollapsedState) {
            this.updateState({collapsedState: effectiveCollapsedState}, () => {
                // After state recalculation, find the target in the new allMatchPaths
                const newAllMatchPaths = this.state.allMatchPaths;
                const newTargetIndex = newAllMatchPaths.indexOf(targetMatchPath);
                if (newTargetIndex !== -1) {
                    // Navigate to the target using its new index
                    this.navigateToMatch(
                        newTargetIndex,
                        newAllMatchPaths,
                        this.state.matchedRows,
                        this.state.collapsedState,
                    );
                }
            });
            return;
        }

        // Target is visible - navigate to it
        this.navigateToMatch(nextTotalIndex, allMatchPaths, matchedRows, effectiveCollapsedState);
    };

    onPrevMatch = () => {
        this.onNextMatch(null, -1);
    };

    onEnterKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.shiftKey || e.ctrlKey) {
                this.onPrevMatch();
            } else {
                this.onNextMatch(null);
            }
        }
    };

    renderToolbar(className?: string) {
        const {matchIndex, matchedRows, filter, collapsedState, allMatchPaths} = this.state;
        const {extraTools, renderToolbar} = this.props;

        // Calculate if there are any collapsed nodes
        const isCollapsed = Object.keys(collapsedState).length > 0;

        if (renderToolbar) {
            return renderToolbar({
                filter,
                matchIndex: matchIndex,
                matchedRows: matchedRows,
                allMatchPaths: allMatchPaths,
                onExpandAll: this.onExpandAll,
                onCollapseAll: this.onCollapseAll,
                onFilterChange: this.onFilterChange,
                onNextMatch: this.onNextMatch,
                onPrevMatch: this.onPrevMatch,
                onEnterKeyDown: this.onEnterKeyDown,
                isCollapsed,
            });
        }

        return (
            <StructuredYsonToolbar
                className={className}
                filter={filter}
                matchIndex={matchIndex}
                matchedRows={matchedRows}
                allMatchPaths={allMatchPaths}
                extraTools={extraTools}
                onExpandAll={this.onExpandAll}
                onCollapseAll={this.onCollapseAll}
                onFilterChange={this.onFilterChange}
                onNextMatch={this.onNextMatch}
                onPrevMatch={this.onPrevMatch}
                onEnterKeyDown={this.onEnterKeyDown}
            />
        );
    }

    onShowFullText = (index: number) => {
        const {
            flattenResult: {searchIndex, data},
        } = this.state;
        this.setState({
            fullValue: {
                value: data[index].value,
                searchInfo: searchIndex[index],
            },
        });
    };

    onHideFullValue = () => {
        this.setState({fullValue: undefined});
    };

    renderFullValueModal() {
        const {fullValue: {value, searchInfo} = {}, settings, filter} = this.state;

        const tmp = unipika.format(value, {...settings, asHTML: false});

        return (
            value && (
                <FullValueDialog
                    onClose={this.onHideFullValue}
                    starts={searchInfo?.valueMatch || []}
                    text={tmp.substring(1, tmp.length - 1)}
                    length={filter.length}
                />
            )
        );
    }

    render() {
        const {toolbarStickyTop} = this.props;

        return (
            <React.Fragment>
                {this.props.customLayout ? (
                    this.props.customLayout({
                        toolbar: this.renderToolbar(),
                        content: this.renderTable(),
                    })
                ) : (
                    <StickyContainer className={block()} topOffset={toolbarStickyTop}>
                        {(params) => {
                            return (
                                <React.Fragment>
                                    {this.renderToolbar(params.topStickyClassName)}
                                    {this.renderTable()}
                                </React.Fragment>
                            );
                        }}
                    </StickyContainer>
                )}
                {this.renderFullValueModal()}
            </React.Fragment>
        );
    }

    getFullyCollapsedState(value: UnipikaValue, isJson: boolean): CollapsedState {
        const {data} = flattenUnipika(value, {isJson});
        return reduce_<UnipikaFlattenTreeItem, CollapsedState>(
            data,
            (acc, {path}) => {
                if (path) {
                    acc[path] = true;
                }
                return acc;
            },
            {},
        );
    }
}
