## Short description

The purpose of `@gravity-ui/react-unipika` is visualizing of JSON and [YSON](https://ytsaurus.tech/docs/en/user-guide/storage/yson) data objects.
The library uses [`@gravity-ui/unipika`](https://github.com/gravity-ui/unipika) and [`@gravity-ui/react-data-table`](https://github.com/gravity-ui/react-data-table) internally.

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
import {ReactUnipika} from '@gravity-ui/react-unipika';

function renderJson(data: any) {
  return <ReactUnipika value={data} />;
}
```

## YSON notice

Actually the library does not support YSON-format "as is", it is impossible to parse any YSON.
But the library may display JSON-objects as YSON, such JSON-objects has reserver field names like `$attributes`, `$value`.

See more examples in [storybook](https://preview.yandexcloud.dev/react-unipika).
