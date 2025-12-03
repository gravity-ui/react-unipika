## Short description

The purpose of `@gravity-ui/react-unipika` is visualizing of JSON and [YSON](https://ytsaurus.tech/docs/en/user-guide/storage/yson) data objects.
The library uses [`@gravity-ui/unipika`](https://github.com/gravity-ui/unipika) and [`@gravity-ui/table`](https://github.com/gravity-ui/table) internally.

### Features

- virtualization
- two scroll modes: window scroll and container scroll
- collaps/expand objects/arrays
- search substring of key/value (case-sensitive and case-insensitive)
- render one literal per line
  - long strings are truncated by ellipsis
    - full value might be seen in dialog

## Install

```bash
$ npm install @gravity-ui/react-unipika
```

Depending on your package manager you may need to install `peerDependencies` manually.

## Usage

The library provides two entry points depending on your scrolling needs:

### Window Scroll (default)

Use this when you want the component to scroll with the browser window:

```ts
import '@gravity-ui/uikit/styles/styles.scss';
import '@gravity-ui/unipika/styles/unipika.scss';

import {ReactUnipika} from '@gravity-ui/react-unipika/window-scroll';

function renderJson(data: any) {
  return <ReactUnipika value={data} />;
}
```

### Container Scroll

Use this when you want the component to scroll within a specific container. You must provide a ref to the scroll container:

```ts
import '@gravity-ui/uikit/styles/styles.scss';
import '@gravity-ui/unipika/styles/unipika.scss';

import {ReactUnipika} from '@gravity-ui/react-unipika/container-scroll';

function renderJson(data: any) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollContainerRef} style={{height: '500px', overflow: 'auto'}}>
      <ReactUnipika value={data} scrollContainerRef={scrollContainerRef} />
    </div>
  );
}
```

## YSON notice

The library does not support YSON-format "as is", i.e. it is impossible to use/parse YSON data.
But it provides the way to render JSON-objects as YSON, such JSON-objects has reserver field names like `$attributes`, `$value`.

See more examples in [storybook](https://preview.yandexcloud.dev/react-unipika).

## Props

### ReactUnipika Component Props

| Prop                    | Type                                                                              | Default   | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------- |
| `value`                 | `any`                                                                             | required  | The data to be rendered                                                           |
| `settings`              | `UnipikaSettings`                                                                 | See below | Settings for Unipika formatting                                                   |
| `inline`                | `boolean`                                                                         | `false`   | Render in inline mode                                                             |
| `children`              | `React.ReactNode`                                                                 | -         | React nodes to render as children                                                 |
| `extraTools`            | `React.ReactNode`                                                                 | -         | Additional React nodes for tools                                                  |
| `virtualized`           | `boolean`                                                                         | `true`    | Enable virtualization for better performance with large data                      |
| `className`             | `string`                                                                          | -         | Custom CSS class name                                                             |
| `customLayout`          | `(args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode` | -         | Function to customize the layout                                                  |
| `toolbarStickyTop`      | `number`                                                                          | `0`       | Top position in pixels for sticky toolbar                                         |
| `renderToolbar`         | `(props: ToolbarProps) => React.ReactNode`                                        | -         | Custom toolbar renderer function                                                  |
| `collapseIconType`      | `CollapseIconType`                                                                | -         | Type of collapse/expand icon to use                                               |
| `showContainerSize`     | `boolean`                                                                         | -         | Show the size of containers (objects/arrays)                                      |
| `initiallyCollapsed`    | `boolean`                                                                         | -         | Whether to render the tree initially collapsed                                    |
| `caseInsensitiveSearch` | `boolean`                                                                         | -         | Enable case-insensitive search                                                    |
| `renderError`           | `(error: unknown) => React.ReactNode`                                             | -         | Custom error renderer function                                                    |
| `scrollContainerRef`    | `React.RefObject<Element \| null>`                                                | -         | **Required for container-scroll only**. Reference to the scroll container element |

### UnipikaSettings

| Setting             | Type      | Default  | Description                                        |
| ------------------- | --------- | -------- | -------------------------------------------------- |
| `asHTML`            | `boolean` | `true`   | Render as HTML                                     |
| `format`            | `string`  | `'json'` | Format type ('json', 'yson', 'raw-json')           |
| `compact`           | `boolean` | `false`  | Use compact rendering                              |
| `escapeWhitespace`  | `boolean` | `true`   | Escape whitespace characters                       |
| `showDecoded`       | `boolean` | `true`   | Show decoded values                                |
| `binaryAsHex`       | `boolean` | `true`   | Display binary data as hexadecimal                 |
| `nonBreakingIndent` | `boolean` | -        | Use non-breaking spaces for indentation            |
| `escapeYQLStrings`  | `boolean` | -        | Escape YQL strings                                 |
| `decodeUTF8`        | `boolean` | -        | Decode UTF-8 encoded strings                       |
| `indent`            | `number`  | -        | Indentation size                                   |
| `break`             | `boolean` | -        | Add line breaks                                    |
| `maxListSize`       | `number`  | -        | Maximum number of items to display in a list       |
| `maxStringSize`     | `number`  | -        | Maximum string length to display before truncating |
| `omitStructNull`    | `boolean` | -        | Omit null values in structures                     |
| `treatValAsData`    | `boolean` | -        | Treat values as data                               |
