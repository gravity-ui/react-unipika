import React from 'react';
import {Dialog, Flex, SegmentedRadioGroup} from '@gravity-ui/uikit';
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

    const [type, setType] = React.useState<'raw' | 'parsed'>('parsed');

    return (
        <Dialog open={true} onClose={onClose}>
            <Dialog.Header caption={'Full value'} />
            <Dialog.Divider />
            <Dialog.Body>
                <Flex direction="column" gap={2} width="70vw" maxHeight="80vh">
                    <SegmentedRadioGroup
                        className={block('full-value-radio-buttons')}
                        options={[
                            {value: 'parsed', content: 'Parsed'},
                            {value: 'raw', content: 'Raw'},
                        ]}
                        onUpdate={setType}
                    />
                    <div className={block('full-value')}>
                        {type === 'raw' && (
                            <FilteredText starts={starts} text={text} length={length} />
                        )}
                        {type === 'parsed' && <pre>{getParsedFullValue(text)}</pre>}
                    </div>
                </Flex>
            </Dialog.Body>
        </Dialog>
    );
}

function getParsedFullValue(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        try {
            return JSON.parse(`"${text}"`);
        } catch {
            return text;
        }
    }
}
