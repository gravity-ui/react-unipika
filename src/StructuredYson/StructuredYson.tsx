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
    searchInCollapsed?: boolean;
}

interface State {
    flattenResult: FlattenUnipikaResult;
    value: Props['value'];
    settings: Props['settings'];
    yson: boolean;
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
    searchInCollapsed?: boolean,
) {
    const flattenResult = flattenUnipika(value, {
        isJson: settings.format !== 'yson',
        collapsedState: collapsedState,
        filter,
        settings: settings,
        caseInsensitive,
        searchInCollapsed,
    });

    const allMatchPaths = flattenResult.allMatchPaths || [];
    // Calculate hiddenMatches for collapsed nodes if searchInCollapsed is enabled
    if (searchInCollapsed && allMatchPaths.length > 0) {
        // Count matches that are inside or at collapsed nodes
        flattenResult.data.forEach((item) => {
            if (item.collapsed && item.path) {
                const prefix = item.path + '/';
                const count = allMatchPaths.filter((matchPath) => {
                    // Match if path is exactly the item path (match at the node itself)
                    // or starts with prefix (match inside the node)
                    return matchPath === item.path || matchPath.startsWith(prefix);
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
        const {value: prevValue, settings: prevSettings, yson: prevYson} = state;
        const {value, settings, searchInCollapsed} = props;
        const res: Partial<State> = {};
        const yson = settings.format === 'yson';
        if (prevSettings !== settings || yson !== prevYson) {
            Object.assign<Partial<State>, Partial<State>>(res, {
                settings,
                yson,
            });
        }
        if (prevValue !== value || !isEmpty_(res)) {
            Object.assign<Partial<State>, Partial<State>>(res, {
                value,
                ...calculateState(
                    value,
                    state.collapsedState,
                    state.filter,
                    props.caseInsensitiveSearch,
                    settings,
                    searchInCollapsed,
                ),
            });
        }
        return isEmpty_(res) ? null : res;
    }

    state: State = this.getInitialState();

    tableRef: TableProps['scrollToRef'] = React.createRef();
    searchRef = React.createRef<HTMLInputElement>();

    getInitialState(): State {
        const {initiallyCollapsed, value, settings} = this.props;
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
        const {value, settings} = this.state;
        const {caseInsensitiveSearch, searchInCollapsed} = this.props;
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
                ...calculateState(
                    value,
                    collapsedState,
                    filter,
                    caseInsensitiveSearch,
                    settings,
                    searchInCollapsed,
                ),
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
        const pathParts = matchPath.split('/');
        for (let i = 1; i <= pathParts.length; i++) {
            const checkPath = pathParts.slice(0, i).join('/');
            if (collapsedState[checkPath]) {
                return checkPath;
            }
        }
        return null;
    };

    onNextMatch = (_event: unknown, diff = 1) => {
        const {matchIndex, matchedRows, allMatchPaths, collapsedState} = this.state;

        const totalMatches = allMatchPaths?.length || 0;

        if (totalMatches === 0) {
            return;
        }

        // Calculate next index in total matches
        let nextTotalIndex = matchIndex + diff;
        nextTotalIndex = ((nextTotalIndex % totalMatches) + totalMatches) % totalMatches;

        const targetMatchPath = allMatchPaths[nextTotalIndex];

        const collapsedParent = this.findCollapsedParent(targetMatchPath, collapsedState);

        // If target is not hidden, it's visible - navigate to it
        if (collapsedParent === null) {
            // Count how many visible matches are before our target
            let visibleMatchCount = 0;
            for (let i = 0; i < nextTotalIndex; i++) {
                if (this.findCollapsedParent(allMatchPaths[i], collapsedState) === null) {
                    visibleMatchCount++;
                }
            }

            // Navigate to the visible match
            if (visibleMatchCount < matchedRows.length) {
                this.setState({matchIndex: nextTotalIndex});
                this.tableRef.current?.scrollToIndex(matchedRows[visibleMatchCount]);
                this.searchRef.current?.focus();
            }
            return;
        }

        // Target is hidden - expand the collapsed parent
        const newCollapsedState = {...collapsedState};
        delete newCollapsedState[collapsedParent];

        // Recalculate state with new collapsed state
        this.updateState({collapsedState: newCollapsedState, matchIndex: nextTotalIndex}, () => {
            // Retry navigation to the same target
            this.onNextMatch(null, 0);
        });
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
                onFilterChange: this.onFilterChange,
                onExpandAll: this.onExpandAll,
                onCollapseAll: this.onCollapseAll,
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
