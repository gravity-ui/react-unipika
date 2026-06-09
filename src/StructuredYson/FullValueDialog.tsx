import React, {useState} from 'react';
import {Dialog, Flex, SegmentedRadioGroup} from '@gravity-ui/uikit';
import {cn} from '../utils/classname';
import {FilteredText} from './FilteredText';

import i18n from './i18n';

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

    const [type, setType] = useState<'raw' | 'parsed'>('parsed');

    return (
        <Dialog open={true} onClose={onClose}>
            <Dialog.Header caption={i18n('full-value_title')} />
            <Dialog.Divider />
            <Dialog.Body>
                <Flex direction="column" gap={2} width="70vw" maxHeight="80vh">
                    <SegmentedRadioGroup
                        className={block('full-value-radio-buttons')}
                        options={[
                            {value: 'parsed', content: i18n('full-value_parsed')},
                            {value: 'raw', content: i18n('full-value_raw')},
                        ]}
                        onUpdate={setType}
                        value={type}
                    />

                    <div className={block('full-value')}>
                        {type === 'raw' ? (
                            <FilteredText starts={starts} text={text} length={length} />
                        ) : (
                            <pre style={{whiteSpace: 'pre-wrap'}}>{getParsedFullValue(text)}</pre>
                        )}
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
