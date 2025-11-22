import React from 'react';

import {Meta, StoryObj} from '@storybook/react';

import {ReactUnipika, ReactUnipikaProps} from '../../container-scroll';

import data from './data.json';
import {Button} from '@gravity-ui/uikit';

function WithScrollContainerComponent(props: Omit<ReactUnipikaProps, 'scrollContainerRef'>) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    return (
        <div
            style={{height: 300, overflow: 'auto', border: '1px solid var(--g-color-line-generic)'}}
            ref={scrollContainerRef}
        >
            <ReactUnipika {...props} scrollContainerRef={scrollContainerRef} />
        </div>
    );
}

const meta: Meta<ReactUnipikaProps> = {
    title: 'ReactUnipika/Container Scroll',
    component: WithScrollContainerComponent,
};
export default meta;

export const Json: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
    },
};

export const Yson: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        settings: {format: 'yson'},
    },
};

function WithCaseInsensitiveSearchComponent() {
    const [caseInsensitiveSearch, setCaseInsensitiveSearch] = React.useState(true);
    return (
        <>
            <Button
                selected={!caseInsensitiveSearch}
                onClick={() => {
                    setCaseInsensitiveSearch((prev) => !prev);
                }}
                qa="qa:case-sensitive-button"
            >
                {caseInsensitiveSearch ? 'Case insensitive' : 'Case sensitive'}
            </Button>
            <ReactUnipika value={data} caseInsensitiveSearch={caseInsensitiveSearch} />
        </>
    );
}

export const WithCaseInsensitiveSearch: StoryObj<ReactUnipikaProps> = {
    render() {
        return <WithCaseInsensitiveSearchComponent />;
    },
};

export const WithContentAbove: StoryObj<ReactUnipikaProps> = {
    render() {
        return (
            <>
                <div style={{height: 500, padding: 250, boxSizing: 'border-box'}}>
                    Some content above
                </div>
                <WithScrollContainerComponent value={data} />
            </>
        );
    },
};

export const WithContainerSize: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        showContainerSize: true,
    },
};

export const WithContainerSizeCollapsed: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        showContainerSize: true,
        initiallyCollapsed: true,
    },
};

export const WithContainerSizeYson: StoryObj<ReactUnipikaProps> = {
    args: {
        value: data,
        settings: {format: 'yson'},
        showContainerSize: true,
    },
};

export const WithError: StoryObj<ReactUnipikaProps> = {
    args: {
        value: {val: Infinity},
        renderError: (error: unknown) => {
            if (error instanceof Error) {
                return <div>{error.message}</div>;
            }
            return 'Unknown error while parsing data';
        },
    },
};
