import React from 'react';

import {StructuredYsonContainerScroll} from '../StructuredYson/StructuredYsonContainerScroll';
import {withReactUnipikaBase} from './ReactUnipikaBase';
import {ReactUnipikaWithScrollContainer} from './types';
import {defaultUnipikaSettings} from './constants';

export const ReactUnipikaContainerScroll = withReactUnipikaBase<ReactUnipikaWithScrollContainer>({
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
            scrollContainerRef,
        } = props;

        return (
            <StructuredYsonContainerScroll
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
            />
        );
    },
});
