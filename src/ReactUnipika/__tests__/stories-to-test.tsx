import {composeStories} from '@storybook/react';

import * as WindowScrollStories from '../__stories__/ReactUnipikaWindowScroll.stories';
import * as ContainerScrollStories from '../__stories__/ReactUnipikaContainerScroll.stories';

export const WindowScroll = composeStories(WindowScrollStories);
export const ContainerScroll = composeStories(ContainerScrollStories);
