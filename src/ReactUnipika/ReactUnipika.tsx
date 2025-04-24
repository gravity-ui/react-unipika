import React from 'react';

import type {Settings} from '@gravity-ui/react-data-table';
// @ts-expect-error
import unipika from '@gravity-ui/unipika/lib/unipika';

import {UnipikaSettings} from '../StructuredYson/types';

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
    tableSettings?: Settings;
    customLayout?: (args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode;
    toolbarStickyTop?: number;
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
    tableSettings,
    customLayout,
    toolbarStickyTop = 0,
}: ReactUnipikaProps) {
    const convertedValue = React.useMemo(() => {
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

        return unipika.converters.yson(value, settings);
    }, [value, settings]);

    const classes = block(
        {
            inline: inline && 'yes',
        },
        className,
    );

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
                    tableSettings={tableSettings}
                    value={convertedValue}
                    settings={settings}
                    extraTools={extraTools}
                    customLayout={customLayout}
                    toolbarStickyTop={toolbarStickyTop}
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
