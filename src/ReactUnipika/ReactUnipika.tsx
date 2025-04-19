import React from 'react';
import isEqual_ from 'lodash/isEqual';

import type {Settings} from '@gravity-ui/react-data-table';
// @ts-expect-error
import unipika from '@gravity-ui/unipika';

import {UnipikaSettings, UnipikaValue} from '../StructuredYson/types';

import {StructuredYson} from '../StructuredYson/StructuredYson';
import {ruCN} from '../utils/classname';

const block = ruCN('react-unipika');

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

interface State {
    convertedValue: UnipikaValue;
    value: ReactUnipikaProps['value'];
    settings: ReactUnipikaProps['settings'];
}

const INITIAL = {};

export class ReactUnipika extends React.Component<ReactUnipikaProps, State> {
    static defaultUnipikaSettings = {
        asHTML: true,
        format: 'json',
        compact: false,
        escapeWhitespace: true,
        showDecoded: true,
        binaryAsHex: true,
    };

    static defaultProps = {
        inline: false,
        virtualized: true,
        settings: ReactUnipika.defaultUnipikaSettings,
        toolbarStickyTop: 0,
    };

    static getDerivedStateFromProps(props: ReactUnipikaProps, state: State) {
        const {value: prevValue, settings: prevSettings} = state;
        const {value, settings = {}} = props;

        if (
            prevValue === INITIAL ||
            !isEqual_(prevValue, value) ||
            !isEqual_(prevSettings, settings)
        ) {
            // TODO: fix me later
            // The call is required because unipika.format() applies default values to a passed settings inplace.
            // We have to leave this call without it the behaviour will be broken.
            if (settings.format === 'raw-json') {
                unipika.formatRaw(value, settings);
            } else {
                unipika.formatFromYSON(value, settings);
            }

            return {
                convertedValue:
                    value === undefined
                        ? ''
                        : settings!.format === 'raw-json'
                        ? unipika.converters.raw(value, settings)
                        : unipika.converters.yson(value, settings),
                value: value,
                settings: settings,
            };
        }
        return null;
    }

    state: State = {
        convertedValue: undefined as any, // getDerivedStateFromProps should provide correct vgitalue for this field
        value: INITIAL,
        settings: {format: ''},
    };

    getFormattedTitle() {
        const {inline} = this.props;
        if (!inline) {
            return undefined;
        }

        const {convertedValue, settings} = this.state;
        const titleSettings = Object.assign({}, settings, {asHTML: false});

        return unipika.format(convertedValue, titleSettings);
    }

    getFormattedValue() {
        const {convertedValue, settings} = this.state;
        return unipika.format(convertedValue, settings);
    }

    render() {
        const {
            inline,
            children,
            virtualized,
            extraTools,
            className,
            tableSettings,
            customLayout,
            toolbarStickyTop,
        } = this.props;
        const {convertedValue, settings} = this.state;

        const classes = block(
            {
                inline: inline && 'yes',
            },
            className,
        );

        return settings!.asHTML ? (
            <div className={classes} title={this.getFormattedTitle()} dir="auto">
                {virtualized ? (
                    <StructuredYson
                        tableSettings={tableSettings}
                        value={convertedValue}
                        settings={settings!}
                        extraTools={extraTools}
                        customLayout={customLayout}
                        toolbarStickyTop={toolbarStickyTop}
                    />
                ) : (
                    <pre
                        className="unipika"
                        dangerouslySetInnerHTML={{
                            __html: this.getFormattedValue(),
                        }}
                    />
                )}
                {children}
            </div>
        ) : (
            <div
                className={classes}
                title={this.getFormattedTitle()}
                dangerouslySetInnerHTML={{
                    __html: this.getFormattedValue(),
                }}
                dir="auto"
            >
                {children}
            </div>
        );
    }
}
