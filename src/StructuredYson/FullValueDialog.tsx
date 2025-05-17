import React from 'react';
import {Dialog, Flex} from '@gravity-ui/uikit';
import {cn} from '../utils/classname';
import {FilteredText} from './Cell';

import './FullValueDialog.scss';

const block = cn('g-ru-full-value-dialog');

export interface FullValueDialogProps {
    onClose: () => void;
    length: number;
    text: string;
    starts: number[];
}

export function FullValueDialog(props: FullValueDialogProps) {
    const {onClose, text, starts, length} = props;

    return (
        <Dialog open={true} onClose={onClose}>
            <Dialog.Header caption={'Full value'} />
            <Dialog.Divider />
            <Dialog.Body>
                <Flex direction="column" gap={2} width="70vw" maxHeight="80vh">
                    <div className={block('full-value')}>
                        <FilteredText starts={starts} text={text} length={length} />
                    </div>
                </Flex>
            </Dialog.Body>
        </Dialog>
    );
}
