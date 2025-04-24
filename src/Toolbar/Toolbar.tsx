import React from 'react';
import {cn} from '../utils/classname';
import './Toolbar.scss';

const block = cn('g-ru-toolbar');

export const TOOLBAR_COMPONENT_HEIGHT = 48;

interface Props {
    className?: string;
    itemsToWrap: Array<{
        name?: string;
        node?: React.ReactNode;
        wrapperClassName?: string;
        growable?: boolean;
        shrinkable?: boolean;
        marginRight?: 'half';
        overflow?: 'hidden';
    }>;
    children?: React.ReactNode;
}

export class Toolbar extends React.Component<Props> {
    render() {
        const {className, children} = this.props;
        return (
            <div className={block(null, className)}>
                <div className={block('container')}>{this.renderItems()}</div>
                {children}
            </div>
        );
    }

    renderItems() {
        const {itemsToWrap = []} = this.props;
        return itemsToWrap.map(
            ({name, node, growable, shrinkable, wrapperClassName, marginRight}, index) => {
                return node ? (
                    <div
                        key={name || index}
                        className={block(
                            'item',
                            {name, growable, shrinkable, 'margin-right': marginRight},
                            wrapperClassName,
                        )}
                    >
                        {node}
                    </div>
                ) : null;
            },
        );
    }
}
