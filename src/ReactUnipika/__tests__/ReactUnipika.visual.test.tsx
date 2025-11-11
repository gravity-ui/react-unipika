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

test('ReactUnipika: search in collapsed - collapsed tree with search', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.Json />, {width: 1280});

    // Collapse all
    await page.getByTestId('qa:structuredyson:collapse-all').click();

    // Enter search term
    await page.getByTestId('qa:structuredyson:search').locator('input').fill('attr');

    // Wait for search to complete
    await page.waitForTimeout(300);

    await expectScreenshot({component: page});
});

test('ReactUnipika: search in collapsed - navigate forward', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.Json />, {width: 1280});

    // Collapse all
    await page.getByTestId('qa:structuredyson:collapse-all').click();

    // Enter search term
    await page.getByTestId('qa:structuredyson:search').locator('input').fill('attr');

    // Wait for search to complete
    await page.waitForTimeout(300);

    // Navigate forward (should expand first collapsed node with match)
    await page.getByTestId('qa:structuredyson:search:next').click();

    // Wait for expansion and navigation
    await page.waitForTimeout(300);

    await expectScreenshot({component: page});
});
