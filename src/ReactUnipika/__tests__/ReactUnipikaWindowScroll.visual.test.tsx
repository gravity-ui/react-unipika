import React from 'react';
import {test} from '../../../playwright/core';

import {WindowScroll as Stories} from './stories-to-test';

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

    // Wait for search to complete by checking match counter is updated
    await page.locator('.g-ru-structured-yson__match-counter').waitFor({state: 'visible'});
    await page.locator('.g-ru-structured-yson__match-counter:has-text("1 / 9")').waitFor();

    // Wait for the first match to be automatically expanded and highlighted text to be visible
    await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("attr")')
        .first()
        .waitFor({state: 'visible'});

    // Verify that only one highlighted element with "attr" is visible on screen
    const visibleHighlightedElements = await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("attr")')
        .filter({hasText: 'attr'})
        .count();
    if (visibleHighlightedElements !== 1) {
        throw new Error(
            `Expected 1 visible highlighted element with "attr", but found ${visibleHighlightedElements}`,
        );
    }

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

    // Wait for search to complete by checking match counter is updated
    await page.locator('.g-ru-structured-yson__match-counter').waitFor({state: 'visible'});
    await page.locator('.g-ru-structured-yson__match-counter:has-text("1 / 9")').waitFor();

    // Navigate forward (should expand first collapsed node with match)
    await page.getByTestId('qa:structuredyson:search:next').click();

    // Wait for expansion and navigation by checking the match counter updates to show position
    await page.locator('.g-ru-structured-yson__match-counter:has-text("2 / 9")').waitFor();

    // Wait for the second match to be visible
    await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("attr")')
        .nth(1)
        .waitFor({state: 'visible'});

    // Verify that exactly 2 highlighted elements with "attr" are visible on screen
    const visibleHighlightedElements = await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("attr")')
        .filter({hasText: 'attr'})
        .count();
    if (visibleHighlightedElements !== 2) {
        throw new Error(
            `Expected 2 visible highlighted elements with "attr", but found ${visibleHighlightedElements}`,
        );
    }

    await expectScreenshot({component: page});
});

test('ReactUnipika: with error', async ({mount, expectScreenshot, page}) => {
    await mount(<Stories.WithError />, {width: 1280});

    await expectScreenshot({component: page});
});

test('ReactUnipika: with case insensitive search with matches', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.WithCaseInsensitiveSearch />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('Attr');

    await expectScreenshot({component: page});
});

test('ReactUnipika: with case insensitive search with matches 2', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.WithCaseInsensitiveSearch />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('attr');

    await expectScreenshot({component: page});
});

test('ReactUnipika: with case insensitive search toggle', async ({mount, page}) => {
    await mount(<Stories.WithCaseInsensitiveSearch />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('Type_1');

    const visibleHighlightedElements = await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("type_1")')
        .filter({hasText: 'Type_1'})
        .count();
    if (visibleHighlightedElements !== 1) {
        throw new Error(
            `Expected 1 visible highlighted elements with "Type_1", but found ${visibleHighlightedElements}`,
        );
    }

    await page.getByTestId('qa:case-sensitive-button').click();
    const newVisibleHighlightedElements = await page
        .locator('.g-ru-cell__filtered_highlighted:has-text("type_1")')
        .filter({hasText: 'Type_1'})
        .count();
    if (newVisibleHighlightedElements !== 0) {
        throw new Error(
            `Expected 0 visible highlighted elements with "Type_1", but found ${visibleHighlightedElements}`,
        );
    }
});

test('ReactUnipika: with case sensitive search no matches', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('Attr');

    await expectScreenshot({component: page});
});

test('ReactUnipika: with case sensitive search with matches', async ({
    mount,
    expectScreenshot,
    page,
}) => {
    await mount(<Stories.Json />, {width: 1280});

    await page.getByTestId('qa:structuredyson:search').locator('input').fill('attr');

    await expectScreenshot({component: page});
});
