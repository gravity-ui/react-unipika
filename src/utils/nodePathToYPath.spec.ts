import {nodePathToYPath, NodePath} from './nodePathToYPath';

type ExpectedYPath = string;

const testsData: Array<[NodePath, ExpectedYPath]> = [
    [[], ''],
    [['@'], '@'],
    [['$attributes'], '@'],
    [['$', 'foo'], 'foo'],
    [['$value', 'foo'], 'foo'],
    [['@', 'foo'], '@foo'],
    [['$attributes', 'foo'], '@foo'],
    [['foo', '$', 'bar'], 'foo/bar'],
    [['foo', '$value', 'bar'], 'foo/bar'],
    [['foo', '0', 'bar'], 'foo/0/bar'],
    [['@', 'foo', 'bar'], '@foo/bar'],
    [['$attributes', 'foo', 'bar'], '@foo/bar'],
    [['$', 'foo', '@'], 'foo/@'],
    [['$value', 'foo', '@'], 'foo/@'],
    [['$value', 'foo', '$attributes'], 'foo/@'],
    [['foo', '0', '@'], 'foo/0/@'],
    [['foo', '0', '$attributes'], 'foo/0/@'],
    [['$', 'foo', '@', 'bar'], 'foo/@bar'],
    [['$value', 'foo', '@', 'bar'], 'foo/@bar'],
    [['$', 'foo', '$attributes', 'bar'], 'foo/@bar'],
    [['foo', '0', '@', 'bar'], 'foo/0/@bar'],
    [['foo', '0', '$attributes', 'bar'], 'foo/0/@bar'],
];

describe('nodePathToYPath', () => {
    it.each(testsData)('should convert nodePath %p to ypath %p', (nodePath, ypath) => {
        expect(nodePathToYPath(nodePath)).toBe(ypath);
    });
});
