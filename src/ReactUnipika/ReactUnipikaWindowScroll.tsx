import React from 'react';

import {StructuredYsonWindowScroll} from '../StructuredYson/StructuredYsonWindowScroll';
import {withReactUnipikaBase} from './ReactUnipikaBase';
import {ReactUnipikaCommonProps} from './types';
import {defaultUnipikaSettings} from './constants';

export const ReactUnipikaWindowScroll = withReactUnipikaBase<ReactUnipikaCommonProps>({
    renderVirtualized: (props, convertedValue) => {
        const {
            settings = defaultUnipikaSettings,
            extraTools,
            customLayout,
            toolbarStickyTop,
            renderToolbar,
            collapseIconType,
            showContainerSize,
            initiallyCollapsed,
            caseInsensitiveSearch,
        } = props;

        return (
            <StructuredYsonWindowScroll
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
            />
        );
    },
});
