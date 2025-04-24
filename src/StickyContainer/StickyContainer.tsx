import React from 'react';

import {cn} from '../utils/classname';
import './StickyContainer.scss';
import {CSSProperties} from '@gravity-ui/uikit';

const block = cn('g-ru-sticky-container');

export function StickyContainer({
    className,
    topOffset = 0,
    children,
}: {
    className?: string;
    topOffset?: number;
    children: (params: {sticky: boolean; topStickyClassName?: string}) => React.ReactNode;
}) {
    const [sticky, setSticky] = React.useState(false);
    const [element, setElement] = React.useState<HTMLDivElement | null>(null);

    const observer = React.useMemo(() => {
        return new IntersectionObserver(
            (entries) => {
                if (entries[0].intersectionRatio === 0) {
                    setSticky(true);
                } else if (entries[0].intersectionRatio === 1) {
                    setSticky(false);
                }
            },
            {threshold: [0, 1], rootMargin: `${-topOffset}px 0px 0px 0px`},
        );
    }, [topOffset]);

    React.useEffect(() => {
        if (element) {
            observer.observe(element);
        }
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [element]);

    const onRef = React.useCallback((div: HTMLDivElement | null) => {
        setElement(div);
    }, []);

    const style = React.useMemo(() => {
        return {'--g-ru-sticky-container-top': `${topOffset}px`} as CSSProperties;
    }, [topOffset]);

    return (
        <div className={block(null, className)} style={style}>
            <div className={block('top')} ref={onRef} />
            {children({
                sticky,
                topStickyClassName: sticky ? block('sticky') : undefined,
            })}
        </div>
    );
}
