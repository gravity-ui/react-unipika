/**
 * Internal path representation for navigating structured data trees (like YSON/JSON).
 *
 * Path segments can be:
 * - `'foo'`, `'bar'` — map/object keys
 * - `'0'`, `'1'`, `'2'` — list/array indices (as strings)
 * - `'@'` or `'$attributes'` — attributes container of current node
 * - `'$'` or `'$value'` — value of a node that has attributes
 */
export type NodePath = string[];

const nodePathToYPathParts = (path: NodePath): Array<string> => {
    const parts: Array<string> = [];

    for (let index = 0; index < path.length; index++) {
        const part = path[index];

        if (part === '$' || part === '$value') {
            continue;
        }

        if (part === '@' || part === '$attributes') {
            const nextPart = path[index + 1];

            if (nextPart === undefined) {
                parts.push('@');
            } else {
                parts.push(`@${nextPart}`);
                index++;
            }

            continue;
        }

        parts.push(part);
    }

    return parts;
};

export const nodePathToYPath = (path: NodePath): string => {
    return nodePathToYPathParts(path).join('/');
};
