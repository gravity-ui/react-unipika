import React from 'react';

// @ts-expect-error
import unipika from '@gravity-ui/unipika/lib/unipika';

import {cn} from '../utils/classname';
import {ReactUnipikaCommonProps} from './types';
import {UnipikaSettings} from '../StructuredYson/types';
import {defaultUnipikaSettings} from './constants';

const block = cn('g-ru-react-unipika');

interface ConvertedValue {
    convertedValue?: any;
    error?: any;
}

function convertValue(value: any, settings: UnipikaSettings): ConvertedValue {
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
            return {convertedValue: ''};
        }

        if (settings.format === 'raw-json') {
            return {convertedValue: unipika.converters.raw(value, settings)};
        }

        return {convertedValue: unipika.converters.yson(value, settings)};
    } catch (error) {
        return {error};
    }
}

interface WithReactUnipikaBaseProps<P extends ReactUnipikaCommonProps> {
    renderVirtualized: (props: P, convertedValue: any) => React.ReactNode;
}

export function withReactUnipikaBase<P extends ReactUnipikaCommonProps>(
    config: WithReactUnipikaBaseProps<P>,
) {
    return function ReactUnipikaBaseComponent(props: P) {
        const {
            value,
            settings = defaultUnipikaSettings,
            inline = false,
            children,
            virtualized = true,
            className,
            renderError,
        } = props;

        const {convertedValue, error} = React.useMemo(
            () => convertValue(value, settings),
            [value, settings],
        );

        const getFormattedTitle = React.useCallback(() => {
            if (!inline) {
                return undefined;
            }

            const titleSettings = Object.assign({}, settings, {asHTML: false});
            return unipika.format(convertedValue, titleSettings);
        }, [inline, settings, convertedValue]);

        const getFormattedValue = React.useCallback(() => {
            return unipika.format(convertedValue, settings);
        }, [convertedValue, settings]);

        const classes = block(
            {
                inline: inline && 'yes',
            },
            className,
        );

        if (error) {
            return renderError?.(error);
        }

        return settings.asHTML ? (
            <div className={classes} title={getFormattedTitle()} dir="auto">
                {virtualized ? (
                    config.renderVirtualized(props, convertedValue)
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
    };
}
