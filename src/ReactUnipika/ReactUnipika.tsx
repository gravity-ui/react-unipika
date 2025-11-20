import React from 'react';

// @ts-expect-error
import unipika from '@gravity-ui/unipika/lib/unipika';

import {CollapseIconType, ToolbarProps, UnipikaSettings} from '../StructuredYson/types';

import {StructuredYson} from '../StructuredYson/StructuredYson';
import {cn} from '../utils/classname';

const block = cn('g-ru-react-unipika');

export interface ReactUnipikaProps {
    settings?: UnipikaSettings;
    value: any;
    inline?: boolean;
    children?: React.ReactNode;
    extraTools?: React.ReactNode;
    virtualized?: boolean;
    className?: string;
    customLayout?: (args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode;
    toolbarStickyTop?: number;
    renderToolbar?: (props: ToolbarProps) => React.ReactNode;
    collapseIconType?: CollapseIconType;
    showContainerSize?: boolean;
    initiallyCollapsed?: boolean;
    caseInsensitiveSearch?: boolean;
    renderError?: (error: unknown) => React.ReactNode;
    scrollContainerRef?: React.RefObject<Element | null>;
    withScrollElement?: boolean;
}

const defaultUnipikaSettings = {
    asHTML: true,
    format: 'json',
    compact: false,
    escapeWhitespace: true,
    showDecoded: true,
    binaryAsHex: true,
};

export function ReactUnipika({
    value,
    settings = defaultUnipikaSettings,
    inline = false,
    children,
    virtualized = true,
    extraTools,
    className,
    customLayout,
    toolbarStickyTop = 0,
    renderToolbar,
    collapseIconType,
    showContainerSize,
    initiallyCollapsed,
    caseInsensitiveSearch,
    renderError,
    scrollContainerRef,
    withScrollElement,
}: ReactUnipikaProps) {
    const {convertedValue, error} = React.useMemo(() => {
        try {
            // TODO: fix me later
            // The call is required because unipika.format() applies default values to a passed settings inplace.
            // We have to leave this call without it the behaviour will be broken.
            if (settings.format === 'raw-json') {
                unipika.formatRaw(value, settings);
            } else {
                unipika.formatFromYSON(value, settings);
            }

            if (value === undefined) {
                return '';
            }

            if (settings.format === 'raw-json') {
                return unipika.converters.raw(value, settings);
            }

            return {convertedValue: unipika.converters.yson(value, settings)};
        } catch (error) {
            return {error};
        }
    }, [value, settings]);

    const classes = block(
        {
            inline: inline && 'yes',
        },
        className,
    );

    if (error) {
        return renderError?.(error);
    }

    function getFormattedTitle() {
        if (!inline) {
            return undefined;
        }

        const titleSettings = Object.assign({}, settings, {asHTML: false});
        return unipika.format(convertedValue, titleSettings);
    }

    function getFormattedValue() {
        return unipika.format(convertedValue, settings);
    }

    return settings.asHTML ? (
        <div className={classes} title={getFormattedTitle()} dir="auto">
            {virtualized ? (
                <StructuredYson
                    value={convertedValue}
                    settings={settings}
                    extraTools={extraTools}
                    customLayout={customLayout}
                    toolbarStickyTop={toolbarStickyTop}
                    renderToolbar={renderToolbar}
                    collapseIconType={collapseIconType}
                    showContainerSize={showContainerSize}
                    initiallyCollapsed={initiallyCollapsed}
                    caseInsensitiveSearch={caseInsensitiveSearch}
                    scrollContainerRef={scrollContainerRef}
                    withScrollElement={withScrollElement}
                />
            ) : (
                <pre
                    className="unipika"
                    dangerouslySetInnerHTML={{
                        __html: getFormattedValue(),
                    }}
                />
            )}
            {children}
        </div>
    ) : (
        <div
            className={classes}
            title={getFormattedTitle()}
            dangerouslySetInnerHTML={{
                __html: getFormattedValue(),
            }}
            dir="auto"
        >
            {children}
        </div>
    );
}
