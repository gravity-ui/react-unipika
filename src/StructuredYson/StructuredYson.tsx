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
    fullValue?: {
        value: UnipikaFlattenTreeItem['value'];
        searchInfo?: SearchInfo;
    };
}

function calculateState(
    value: State['value'],
    collapsedState: CollapsedState,
    filter: string,
    settings: UnipikaSettings,
) {
    const flattenResult = flattenUnipika(value, {
        isJson: settings.format !== 'yson',
        collapsedState: collapsedState,
        filter,
        settings: settings,
    });

    return Object.assign(
        {},
        {
            flattenResult,
            matchedRows: Object.keys(flattenResult.searchIndex).map(Number),
        },
    );
}

export class StructuredYson extends React.PureComponent<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State) {
        const {value: prevValue, settings: prevSettings, yson: prevYson} = state;
        const {value, settings} = props;
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
                ...calculateState(value, state.collapsedState, state.filter, settings),
            });
        }
        return isEmpty_(res) ? null : res;
    }

    state: State = {
        value: {} as any, // valid value will be provided from getDerivedStateFromProps call
        flattenResult: {data: [], searchIndex: {}},
        settings: {},
        yson: true,
        collapsedState: {},

        filter: '',
        matchIndex: -1,
        matchedRows: [],
    };

    tableRef: TableProps['scrollToRef'] = React.createRef();
    searchRef = React.createRef<HTMLInputElement>();

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
                ...calculateState(value, collapsedState, filter, settings),
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
        const {collapseIconType} = this.props;

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
        const {data} = flattenUnipika(value, {isJson: !yson});
        const collapsedState = reduce_(
            data,
            (acc, {path}) => {
                if (path) {
                    acc[path] = true;
                }
                return acc;
            },
            {} as CollapsedState,
        );
        this.updateState({collapsedState});
    };

    onFilterChange = (filter: string) => {
        this.updateState({filter, matchIndex: 0}, () => {
            this.onNextMatch(null, 0);
        });
    };

    onNextMatch = (_event: unknown, diff = 1) => {
        const {matchIndex, matchedRows} = this.state;
        if (isEmpty_(matchedRows)) {
            return;
        }

        let index = (matchIndex + diff) % matchedRows.length;
        if (index < 0) {
            index = matchedRows.length + index;
        }

        if (index !== matchIndex) {
            this.setState({matchIndex: index});
        }

        this.tableRef.current?.scrollToIndex(matchedRows[index]);
        this.searchRef.current?.focus();
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
        const {matchIndex, matchedRows, filter, collapsedState} = this.state;
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
}
