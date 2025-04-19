import React from 'react';

import {ruCN} from '../utils/classname';
import './StickyContainer.scss';

const block = ruCN('sticky-container');

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

    return (
        <div className={block(null, className)}>
            <div className={block('top')} ref={onRef} />
            {children({
                sticky,
                topStickyClassName: sticky ? block('sticky', {top: true}) : undefined,
            })}
        </div>
    );
}
