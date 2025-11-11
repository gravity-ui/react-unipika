import React from 'react';
import {test} from '../../../playwright/core';

import {Stories} from './stories-to-test';

test('ReactUnipika: first render', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});
    await expectScreenshot({component: page});
    await expectScreenshot();
});

test('ReactUnipika: search next', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('level10_item0');

    await page.getByTestId('qa:structuredyson:search:next').click();
    await expectScreenshot({component: page});
});

test('ReactUnipika: search next by Enter', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('level10_item0');

    await page.getByTestId('qa:structuredyson:search').locator('input').focus();
    await page.keyboard.press('Enter');

    await page.getByText('level8_item3').waitFor({state: 'visible'});

    await expectScreenshot({component: page});
});

test('ReactUnipika: search prev', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('level10_item0');

    await page.getByTestId('qa:structuredyson:search:prev').click();
    await expectScreenshot({component: page});
});

test('ReactUnipika: search prev by SHIFT+Enter', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('level10_item0');

    await page.getByTestId('qa:structuredyson:search').locator('input').focus();
    await page.keyboard.press('Shift+Enter');

    await page.getByText('level8_item3').waitFor({state: 'visible'});

    await expectScreenshot({component: page});
});

test('ReactUnipika: preview', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('value-to-search');

    await page.locator('.g-ru-clickable-text').click();
    await expectScreenshot({component: page});
});

test('ReactUnipika:yson', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.Yson />, {width: 1280});

    await expectScreenshot({component: page});
});

test('ReactUnipika: with content above', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.WithContentAbove />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('level8_item4');

    await expectScreenshot({component: page});
});

test('ReactUnipika: json with container size', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.WithContainerSize />, {width: 1280});

    await expectScreenshot({component: page});
});

test('ReactUnipika: json with container size collapsed initially', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.WithContainerSizeCollapsed />, {width: 1280});

    await expectScreenshot({component: page});
});

test('ReactUnipika: with case sensitive search no matches', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.WithCaseInsensitiveSearch />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('Attr');

    await expectScreenshot({component: page});
});
test('ReactUnipika: with case sensitive search with matches', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.WithCaseInsensitiveSearch />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('attr');

    await expectScreenshot({component: page});
});
