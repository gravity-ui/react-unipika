## Short description

The purpose of `@gravity-ui/react-unipika` is visualizing of JSON and [YSON](https://ytsaurus.tech/docs/en/user-guide/storage/yson) data objects.
The library uses [`@gravity-ui/unipika`](https://github.com/gravity-ui/unipika) and [`@gravity-ui/react-data-table`](https://github.com/gravity-ui/table internally.

### Features

- virtualization
- collaps/expand objects/arrays
- search substring of key/value
- render one literal per line
  - long strings are truncated by ellipsis
    - full value might be seen in dialog

## Install

```bash
$ npm install @gravity-ui/react-unipika
```

Depending on your package manager you may need to install `peerDependencies` manually.

## Usage

```ts
import '@gravity-ui/uikit/styles/styles.scss';
import '@gravity-ui/unipika/styles/unipika.scss';

import {ReactUnipika} from '@gravity-ui/react-unipika';

function renderJson(data: any) {
  return <ReactUnipika value={data} />;
}
```

## YSON notice

The library does not support YSON-format "as is", i.e. it is impossible to use/parse YSON data.
But it provides the way to render JSON-objects as YSON, such JSON-objects has reserver field names like `$attributes`, `$value`.

See more examples in [storybook](https://preview.yandexcloud.dev/react-unipika).

## Props

### ReactUnipika Component Props

| Prop               | Type                                                                              | Default   | Description                                                  |
| ------------------ | --------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------ |
| `value`            | `any`                                                                             | required  | The data to be rendered                                      |
| `settings`         | `UnipikaSettings`                                                                 | See below | Settings for Unipika formatting                              |
| `inline`           | `boolean`                                                                         | `false`   | Render in inline mode                                        |
| `children`         | `React.ReactNode`                                                                 | -         | React nodes to render as children                            |
| `extraTools`       | `React.ReactNode`                                                                 | -         | Additional React nodes for tools                             |
| `virtualized`      | `boolean`                                                                         | `true`    | Enable virtualization for better performance with large data |
| `className`        | `string`                                                                          | -         | Custom CSS class name                                        |
| `customLayout`     | `(args: {toolbar: React.ReactNode; content: React.ReactNode}) => React.ReactNode` | -         | Function to customize the layout                             |
| `toolbarStickyTop` | `number`                                                                          | `0`       | Top position in pixels for sticky toolbar                    |

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
