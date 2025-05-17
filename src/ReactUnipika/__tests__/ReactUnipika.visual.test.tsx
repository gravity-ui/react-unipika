import React from 'react';
import {test} from '../../../playwright/core';

import {Stories} from './stories-to-test';

test('EditableList: Frozen', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Default />, {width: 1280});
    await expectScreenshot({component: page});
    await page.mouse.wheel(0, 400);
    await expectScreenshot({component: page});
    await expectScreenshot();
});
