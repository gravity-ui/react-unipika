import type {UnipikaFlattenTreePath, UnipikaFlattenTreeJoinedPath} from './flattenUnipika';

export const getFlattenTreeJoinedPath = (
    path: UnipikaFlattenTreePath,
): UnipikaFlattenTreeJoinedPath => {
    return path.join('/');
};
