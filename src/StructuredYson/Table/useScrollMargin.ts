import {useState, useEffect} from 'react';

type TimeoutId = ReturnType<typeof setTimeout>;

type Params = {
    element: Element | null;
    timeout: number;
};

export const useScrollMargin = ({element, timeout}: Params): number | undefined => {
    const [scrollMargin, setScrollMargin] = useState<number>();

    useEffect(() => {
        if (!element) {
            return undefined;
        }

        let id: TimeoutId;

        const updateScrollMargin = () => {
            const {top} = element.getBoundingClientRect();
            const nextScrollMargin = Math.round(top + window.scrollY);

            setScrollMargin((prevScrollMargin) => {
                if (prevScrollMargin !== nextScrollMargin) {
                    return nextScrollMargin;
                }

                return prevScrollMargin;
            });

            id = setTimeout(updateScrollMargin, timeout);
        };

        updateScrollMargin();

        return () => {
            clearTimeout(id);
        };
    }, [element, timeout]);

    return scrollMargin;
};
